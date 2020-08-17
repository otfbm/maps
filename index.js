const fs = require('fs').promises;
const { join } = require('path');
const drawCanvas = require("./draw-canvas.js");

exports.handler = async (event, context) => {
  const query = (event && event.queryStringParameters) || {};
  const path = event.rawPath || event.path;

  try {
    const canvas = await drawCanvas(path, query);
    const data = canvas.toDataURL("image/jpeg", { quality: 0.8 });
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
    console.log(err);
    const errorImage = await fs.readFile(join(__dirname, './5xx.jpg'));
    return {
      statusCode: 200,
      headers: {
        "content-type": "image/jpeg",
      },
      body: errorImage.toString('base64'),
      isBase64Encoded: true,
    };
  }
};
