const { join } = require("path");
const fs = require("fs").promises;
const fetch = require("node-fetch");
const InputParser = require("./input-parser.js");
const Board = require("./board.js");
const Options = require("./options.js");
const Renderer = require("./renderer/index.js");
const Grid = require("./grid.js");
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-2" });
const cw = new AWS.CloudWatch({ apiVersion: "2010-08-01" });

const base64Fetch = async (url) => {
  const res = await fetch(url);
  if (res.ok) {
    const buffer = await res.buffer();
    return `data:${res.headers.get("content-type")};base64,${buffer.toString(
      "base64"
    )}`;
  }
  const err = new Error(
    `We couldn't seem to get our claws on the token image you asked for`
  );
  err.status = res.status;
  throw err;
};

const imageCodeFetch = async (url) => {
  if (!url) return null;
  let status = 200;
  try {
    const u = new URL(join('meta', Buffer.from(url).toString('base64')), 'https://token.otfbm.io');
    const res = await fetch(u);
    if (res.ok) {
      const text = await res.text();
      const code = text.match(/<body>([A-Za-z0-9]*)<\/body>/);
      return code[1];
    }
    status = res.status;
  } catch(err) {
    console.error(err);
    status = 500
  }
  const error = new Error(
    `We couldn't seem to get our claws on the token code for the image you asked for`
  );
  error.status = status;
  throw error;
};

let fallbackTokenImage;
const fetchTokenImageAsBase64 = async (code) => {
  if (!code) return null;

  try {
    return await base64Fetch(`https://token.otfbm.io/face/${code}`);
  } catch (err) {
    // swallow error and try img instead of face
    if (err.status === 404) {
      try {
        return await base64Fetch(`https://token.otfbm.io/img/${code}`);
      } catch (err) {
        // noop
      }
    }
  }

  if (!fallbackTokenImage) {
    const buff = await fs.readFile(join(__dirname, "missing-token.jpg"));
    fallbackTokenImage = buff.toString("base64");
  }
  return `data:image/jpeg;base64,${fallbackTokenImage}`;
};

const getBracket = (val, brackets) => {
  // Given list of brackets of form "<x", "y-z", ">s"
  // return first bracket in list which returns true for val
  for (bracket in brackets) {
    if (bracket.charAt(0) === "<") {
      if (val < parseFloat(bracket.substring(1, bracket.length))) {
        return bracket;
      }
    }
    if (bracket.charAt(0) === ">") {
      if (val > parseFloat(bracket.substring(1, bracket.length))) {
        return bracket;
      }
    }
    const [lower, upper] = bracket.split("-");
    if (parseFloat(lower) <= val && val <= parseFloat(upper)) {
      return bracket
    }
  }
}

module.exports = async function main(pathname, query, metrics = true) {
  const options = new Options();
  const input = new InputParser();
  await input.parse(options, pathname, query);

  if (metrics) {
    const cellsize = getBracket(options._cellSize, ["<40", "40-59", "60-79", "80-99"]);
    const numTokens = getBracket(input.tokens.length, ["1-5", "6-10", "11-15", "16-20", ">20"]);
    const numLines = getBracket(input.lines.length, ["1-5", "6-10", "11-15", "16-20", ">20"]);
    const numEffects = getBracket(input.effects.length, ["1-5", "6-10", "11-15", "16-20", ">20"]);
    const numIcons = getBracket(input.icons.length, ["1-5", "6-10", "11-15", "16-20", ">20"]);
    const numOverlays = getBracket(input.overlays.length, ["1-5", "6-10", "11-15", "16-20", ">20"]);

    const datapoint = {
      MetricData: [
        {
          MetricName: "MapOptions",
          StorageResolution: 1,
          Dimensions: [
            {
              Name: "DarkMode",
              Value: String(!!options.darkMode),
            },
            {
              Name: "CellSize",
              Value: cellsize,
            },
            {
              Name: "UsesBackgroundImage",
              Value: String(!!options.background.image),
            },
            {
              Name: "EdgeOpacity",
              Value: String(!!options.edgeOpacity),
            },
            {
              Name: "Font",
              Value: options.font,
            },
            {
              Name: "GridOpacity",
              Value: String(options.gridOpacity),
            },
          ],
          Unit: "None",
          Value: 1,
        },
        {
          MetricName: "MapOverlays",
          StorageResolution: 1,
          Dimensions: [
            {
              Name: "NumTokens",
              Value: numTokens,
            },
            {
              Name: "NumLines",
              Value: numLines,
            },
            {
              Name: "NumEffects",
              Value: numEffects,
            },
            {
              Name: "NumIcons",
              Value: numIcons,
            },
            {
              Name: "NumOverlays",
              Value: numOverlays,
            },
          ],
          Unit: "None",
          Value: 1,
        },
      ],
      Namespace: "UsageData",
    };

    try {
      await new Promise((resolve, reject) => {
        cw.putMetricData(datapoint, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch(err) {
      console.log('Failed to push metrics, swallowing error', err); 
    }
  }

  const renderer = new Renderer(options);

  const board = new Board({
    ctx: renderer.ctx,
    options,
  });

  // TODO: refactor to match the TODO below
  for (const { x, y, item } of input.icons) {
    board.placeItem(x, y, item);
  }
  board.addLines(input.lines);
  board.addEffects(input.effects);

  // TODO: recalculate icons by inspecting the data structure

  board.draw();

  // TODO: replace board implementation with these methods
  // renderer.drawAxis(grid);
  // renderer.drawGridLines(grid);
  // for (const wall of walls) {
  //   renderer.drawWall(wall);
  // }
  // for (const effect of effects) {
  //   renderer.drawEffect(effect);
  // }

  const grid = new Grid(options);

  for (const overlay of input.overlays) {
    grid.add(overlay);
  }

  const tokenCodes = await Promise.all(
    input.tokens.map((tn) => imageCodeFetch(tn.imageURL))
  );
  for (let i = 0; i < input.tokens.length; i++) {
    if (tokenCodes[i] && !input.tokens[i].imageCode) {
      input.tokens[i].imageCode = tokenCodes[i];
    }
  }
  const tokenImages = await Promise.all(
    input.tokens.map((tn) => fetchTokenImageAsBase64(tn.imageCode))
  );
  for (let i = 0; i < input.tokens.length; i++) {
    input.tokens[i].image = tokenImages[i];
  }
  for (const overlay of input.tokens) {
    grid.add(overlay);
  }

  for (const cell of grid) {
    renderer.renderOverlay(cell);
  }

  // overlays are drawn 2nd to last
  board.drawEffects();

  // border is drawn last so nothing overlaps it
  board.drawBorder();

  return renderer.canv;
};
