const drawCanvas = require("./draw-canvas.js");
const fetch = require("node-fetch");

module.exports = async (event, context) => {
  const { bg } = event.queryStringParameters;
  const { path } = event.requestContext.http;
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
  const canvas = drawCanvas(path, backgroundImage);
  const data = canvas.toDataURL("image/jpeg", { quality: 1 });
  const stripped = data.replace(/^data:image\/\w+;base64,/, "");
  const buff = new Buffer(stripped, "base64");

  return {
    statusCode: 200,
    headers: {
      'content-type': "image/jpeg",
    },
    body: buff,
  };
};
