const { Image } = require('canvas')

module.exports = ({
  gridsize,
  size,
  color,
  fontcolor,
  fontsize,
  label,
  image,
}, ctx) => {
  const whitelineModifier = size < 41 ? 1.5 : 2;
  const radius = (size + 1) / 2 - 3;
  const xy = size < gridsize ? (gridsize + 1) / 2 : (size + 1) / 2;
  const imageTL = size < gridsize ? (gridsize - size) / 2 : 0;

  if (image && size >= 40) {
    ctx.beginPath();
    ctx.arc(xy, xy, radius - whitelineModifier, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = whitelineModifier + 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(xy, xy, radius - whitelineModifier, 0, Math.PI * 2);
    ctx.clip();

    const img = new Image();
    img.onload = () => ctx.drawImage(img, imageTL, imageTL, size, size);
    img.onerror = err => { throw err };
    img.src = image;
  } else {
    ctx.beginPath();
    ctx.arc(xy, xy, radius - whitelineModifier, 0, Math.PI * 2);
    ctx.strokeStyle = '#f4f6ff';
    ctx.lineWidth = whitelineModifier;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(xy, xy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#07031a';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (!image || size < 40) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontsize}px AzoSans`;
    ctx.fillStyle = fontcolor;
    ctx.fillText(label, xy, xy);
  }
}
