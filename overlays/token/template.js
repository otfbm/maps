module.exports = ({
  size,
  color,
  fontcolor,
  fontsize,
  label,
}, ctx) => {
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2);
  ctx.strokeStyle = '#f4f6ff';
  ctx.lineWidth = '3.5%';
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.48, 0, Math.PI * 2);
  ctx.strokeStyle = '#07031a';
  ctx.lineWidth = '2.5%';
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontsize}px AzoSans`;
  ctx.fillStyle = fontcolor;
  ctx.fillText(
    label,
    size / 2,
    size / 2,
  )
}
