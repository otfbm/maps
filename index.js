const drawCanvas = require("./draw-canvas.js");
const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const query = (event && event.queryStringParameters) || {};
  const path = event.rawPath || event.path;
  const { bg } = query;

  let backgroundImage = null;
  if (bg) {
    try {
      const res = await fetch(bg);
      const buffer = await res.buffer();
      backgroundImage = `data:${
        res.headers["content-type"]
      };base64,${buffer.toString("base64")}`;
    } catch (err) {
      // noop
    }
  }

  try {
    const canvas = drawCanvas(path, backgroundImage);
    const data = canvas.toDataURL("image/jpeg", { quality: 1 });
    const stripped = data.replace(/^data:image\/\w+;base64,/, "");

    return {
      statusCode: 200,
      headers: {
        "content-type": "image/jpeg",
      },
      body: stripped,
      isBase64Encoded: true,
    };
  } catch (err) {
    return err.message;
  }
};
