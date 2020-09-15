const { Image } = require('canvas')

module.exports = ({
  gridsize,
  size,
  color,
  fontcolor,
  fontsize,
  label,
  image,
  font
}, ctx) => {
  const whitelineModifier = size < 41 ? 1.5 : 2;
  const radius = (size + 1) / 2 - 3;
  const xy = size < gridsize ? (gridsize + 1) / 2 : (size + 1) / 2;
  const imageTL = size < gridsize ? (gridsize - size) / 2 : 0;
  let tokenEdgeColour = '#07031a';

  // inner token edge
  ctx.beginPath();
  ctx.arc(xy, xy, radius - whitelineModifier, 0, Math.PI * 2);
  ctx.strokeStyle = '#f4f6ff';
  ctx.lineWidth = whitelineModifier;
  ctx.stroke();

  if (image && size >= 40) {
    // fill with image
    ctx.save()
    ctx.clip();
    const img = new Image();
    img.onload = () => ctx.drawImage(img, imageTL, imageTL, size, size);
    img.onerror = err => { throw new Error('Failed to load token image') };
    img.src = image;
    ctx.restore()
    tokenEdgeColour = color;
  } else {
    // fill with colour and label
    ctx.fillStyle = color;
    ctx.fill();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontsize}px ${font}`;
    ctx.fillStyle = fontcolor;
    ctx.fillText(label, xy, xy);
  }

  // outer token edge
  ctx.beginPath();
  ctx.arc(xy, xy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = tokenEdgeColour;
  ctx.lineWidth = 1;
  ctx.stroke();
}
