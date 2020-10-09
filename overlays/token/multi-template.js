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

  // Since we're only drawing a partial wedge, the white line does not go the full wedge
  // The perpendicular distance from white line to wedge edge is whitelineModifier. Call that x, and radius r
  // The line from centre to end of white line arc is length r-x, and from end of white line perpendicular
  // To edge of wedge is x, meaning the angle between end of white line and edge of wedge is
  // Inverse sin of x/r-x
  const whitelineAngularModifier = Math.asin((whitelineModifier)/(radius - whitelineModifier));
  const nTokens = tokenSpecs.length;
  const specialOffset = nTokens === 2 ? 1/8 : nTokens === 3 ? 1/12 : 0;
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
    const startPercentage = specialOffset + (parseInt(tokenIndex) / nTokens);
    const endPercentage = specialOffset + ((parseInt(tokenIndex) + 1) / nTokens);
    const toCenter = () => ctx.lineTo(xy, xy);
    const toOffsetCenter = (offsetRadius, offsetAngle) => {
      ctx.lineTo(xy + offsetX(offsetRadius, offsetAngle), xy + offsetY(offsetRadius, offsetAngle));
    }
    const offsetX = (offsetRadius, offsetAngle) => {
      return offsetRadius * Math.cos(offsetAngle);
    }
    const offsetY = (offsetRadius, offsetAngle) => {
      return offsetRadius * Math.sin(offsetAngle);
    }
    const averageAngle = (Math.PI * 2 * ((startPercentage + endPercentage) / 2));
    const whitelineRadialOffset = whitelineModifier;
    const whitelineAngularOffset = averageAngle;
    ctx.beginPath();
    if (hasSubLabel) {
      // TODO Sublabelling for multi-tokens
      toOffsetCenter(whitelineRadialOffset, whitelineAngularOffset);
      ctx.arc(xy, xy, radius - whitelineModifier,  (Math.PI * 2 * startPercentage) + whitelineAngularModifier, (Math.PI * 2 * endPercentage) - whitelineAngularModifier);
      toOffsetCenter(whitelineRadialOffset, whitelineAngularOffset);
    } else {
      toOffsetCenter(whitelineRadialOffset, whitelineAngularOffset);
      ctx.arc(xy, xy, radius - whitelineModifier,  (Math.PI * 2 * startPercentage) + whitelineAngularModifier, (Math.PI * 2 * endPercentage) - whitelineAngularModifier);
      toOffsetCenter(whitelineRadialOffset, whitelineAngularOffset);
    }
    ctx.strokeStyle = '#f4f6ff';
    ctx.lineWidth = whitelineModifier;
    ctx.stroke();
  
    if (image && size >= 40) {
      // fill with image
      ctx.save();
      ctx.clip();
      const img = new Image();
      img.onload = () => ctx.drawImage(img, imageTL + offsetX(radius * 0.5, whitelineAngularOffset), imageTL + offsetY(radius * 0.5, whitelineAngularOffset), size, size);
      img.onerror = err => { throw new Error('Failed to load token image') };
      img.src = image;
      ctx.restore();
      tokenEdgeColour = color;
  
      if (hasSubLabel) {
        // TODO: Support sublabels
      }
    } else {
      // fill with colour and label
      ctx.fillStyle = color;
      ctx.fill();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fontsize  * (1 - 0.1 * nTokens)}px ${font}`;
      ctx.fillStyle = fontcolor;
      ctx.save();
      ctx.clip();
      ctx.fillText(label, xy + offsetX(radius * 0.5, whitelineAngularOffset), xy + offsetY(radius * 0.5, whitelineAngularOffset));
      ctx.restore();
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
