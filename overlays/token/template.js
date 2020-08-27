module.exports = ({
  gridsize,
  size,
  color,
  fontcolor,
  fontsize,
  label,
}, ctx) => {
  const whitelineModifier = size < 41 ? 3.5 : 4;
  const xy = size < gridsize ? gridsize / 2 : size / 2;

  ctx.beginPath();
  ctx.arc(xy, xy, size / 2 - whitelineModifier, 0, Math.PI * 2);
  ctx.strokeStyle = '#f4f6ff';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(xy, xy, size / 2 - 2, 0, Math.PI * 2);
  ctx.strokeStyle = '#07031a';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontsize}px AzoSans`;
  ctx.fillStyle = fontcolor;
  ctx.fillText(label, xy, xy);
}
