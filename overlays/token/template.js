const { Image } = require('canvas')

const subLabelFontSize = 14;

module.exports = ({
  gridsize,
  size,
  color,
  fontcolor,
  fontsize,
  label,
  subLabel,
  image,
  font
}, ctx) => {

  const roundToHalf = (num) => {
    return Math.floor(num) + 0.5;
  }

  const whitelineModifier = size < 41 ? 1.5 : 2;
  const radius = roundToHalf((size + 1) / 2 - 3);
  const xy = Math.floor(size < gridsize ? (gridsize + 1) / 2 : (size + 1) / 2);
  const imageTL = size < gridsize ? (gridsize - size) / 2 : 0;
  let tokenEdgeColour = '#07031a';
  let hasSubLabel = image && size >= 40 && subLabel;

  // inner token edge
  ctx.beginPath();
  if (hasSubLabel) {
    ctx.arc(xy, xy, radius - whitelineModifier, 0, Math.PI * 0.5, true);
    ctx.lineTo(xy + radius - whitelineModifier, xy + radius - whitelineModifier);
    ctx.lineTo(xy + radius - whitelineModifier, xy);
  } else
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

    if (hasSubLabel) {
      ctx.beginPath();

      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = `${subLabelFontSize}px ${font}`;

      ctx.fillStyle = color;
      ctx.rect(xy + radius, xy + radius, -radius, -(subLabelFontSize + 2));
      ctx.fill();

      ctx.fillStyle = fontcolor;
      ctx.fillText(subLabel, xy + radius / 2, xy + radius);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(roundToHalf(xy), roundToHalf(xy + radius - whitelineModifier));
      ctx.lineTo(roundToHalf(xy), roundToHalf(xy + radius - (subLabelFontSize + 3)));
      ctx.lineTo(roundToHalf(xy + radius - whitelineModifier), roundToHalf(xy + radius - (subLabelFontSize + 3)));
      ctx.stroke();
    }
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
  if (hasSubLabel) {
    ctx.arc(xy, xy, radius, 0, Math.PI * 0.5, true);
    ctx.lineTo(roundToHalf(xy + radius), roundToHalf(xy + radius));
    ctx.lineTo(roundToHalf(xy + radius), roundToHalf(xy));
    ctx.strokeStyle = '#07031a';
  } else {
    ctx.arc(xy, xy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = tokenEdgeColour;
  }
  ctx.lineWidth = 1;
  ctx.stroke();
}
