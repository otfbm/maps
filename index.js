import drawCanvas from "./draw-canvas.js";
import drawError from "./draw-error.js";

export const handler = async (event, context, metrics) => {
  let stripped;
  try {
    const query = (event && event.multiValueQueryStringParameters) || {};
    const path = event.rawPath || event.path;
    console.log(query, path)
    const canvas = await drawCanvas(path, query, metrics);
    console.log(canvas)
    const data = canvas.toDataURL("image/jpeg", { quality: 0.80 });
    console.log(data)
    stripped = data.replace(/^data:image\/\w+;base64,/, "");
  } catch (err) {
    console.log(err)
    // const canvas = await drawError(err.message);
    // const data = canvas.toDataURL("image/jpeg", { quality: 0.80 });
    // stripped = data.replace(/^data:image\/\w+;base64,/, "");
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: err.message, content: err }),
      // isBase64Encoded: true,
    }; 
  }

  return {
    statusCode: 200,
    headers: {
      "content-type": "image/jpeg",
    },
    body: stripped,
    isBase64Encoded: true,
  };
};
