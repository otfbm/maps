const { Image } = require('canvas')

// For rendering multiple tokens on the same space

const subLabelFontSize = 14;

module.exports = ({
  gridsize,
  size,
  tokenSpecs
}, ctx) => {

  let borderWidth = 3;
  let boxEdgeWidth = 2;
  let whitelineModifier = 3;
  let pixelAdjustment = 0.5;
  if (size <= 60) {
    borderWidth = 1;
    boxEdgeWidth = 1;
    whitelineModifier = 1.5;
  } else if (size <= 120) {
    borderWidth = 2;
    boxEdgeWidth = 1;
    whitelineModifier = 2;
    pixelAdjustment = 0;
  } 

  const snapToPx = (num) => {
    return Math.floor(num) + pixelAdjustment;
  }

  const snapToSinglePx = (num) => {
    return Math.floor(num) + 0.5;
  }

  const radius = snapToPx((size + 1) / 2 - 3);
  const xy = Math.floor(size < gridsize ? (gridsize + 1) / 2 : (size + 1) / 2);
  const imageTL = size < gridsize ? (gridsize - size) / 2 : 0;
  let tokenEdgeColour = '#07031a';

  const nTokens = tokenSpecs.length;
  const specialOffset = nTokens === 2 ? 0.125 : 0;
  for (tokenIndex in tokenSpecs) {
    const {
      color,
      fontcolor,
      fontsize,
      label,
      subLabel,
      image,
      font
    } = tokenSpecs[tokenIndex];
    const hasSubLabel = Boolean(image && size >= 40 && subLabel);
    // inner token edge
    const startPercentage = specialOffset + parseInt(tokenIndex) / nTokens;
    const endPercentage = specialOffset + (parseInt(tokenIndex) + 1) / nTokens;
    ctx.beginPath();
    const toCenter = () => ctx.lineTo(xy, xy);
    if (hasSubLabel) {
      // TODO Sublabelling for multi-tokens
      toCenter()
      ctx.arc(xy, xy, radius - whitelineModifier, Math.PI * 2 * startPercentage, Math.PI * 2 * endPercentage);
      toCenter()
    } else {
      toCenter()
      ctx.arc(xy, xy, radius - whitelineModifier, Math.PI * 2 * startPercentage, Math.PI * 2 * endPercentage);
      toCenter()
    }
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
        let useFullLabel = ctx.measureText(label).width < radius - 3;
        ctx.fillText(useFullLabel ? label : subLabel, xy + radius / 2, xy + radius);
  
        ctx.beginPath();
        ctx.lineWidth = boxEdgeWidth;
        ctx.moveTo(snapToSinglePx(xy), snapToSinglePx(xy + radius));
        ctx.lineTo(snapToSinglePx(xy), snapToSinglePx(xy + radius - (subLabelFontSize + boxEdgeWidth + 1)));
        ctx.lineTo(snapToSinglePx(xy + radius), snapToSinglePx(xy + radius - (subLabelFontSize + boxEdgeWidth + 1)));
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
      // TODO Sublabelling for multi-tokens
      toCenter()
      ctx.arc(xy, xy, radius, Math.PI * 2 * startPercentage, Math.PI * 2 * endPercentage);
      toCenter()
      ctx.strokeStyle = tokenEdgeColour;
    } else {
      toCenter()
      ctx.arc(xy, xy, radius, Math.PI * 2 * startPercentage, Math.PI * 2 * endPercentage);
      toCenter()
      ctx.strokeStyle = tokenEdgeColour;
    }
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }
}
