const { join } = require("path");
const fs = require("fs").promises;
const canvas = require("canvas");

const { createCanvas, Image } = canvas;
const WIDTH = 419;
const HEIGHT = 600;

module.exports = async function error(msg) {
  const buffer = await fs.readFile(new URL('./5xx.jpg', import.meta.url));
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.onerror = () => {};
  img.src = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  ctx.fillText(msg, 135, 70, 250);

  return canvas;
};
