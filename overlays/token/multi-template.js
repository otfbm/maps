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
  // Used to neaten special cases
  const specialOffset = nTokens === 2 ? 1/8 : nTokens === 3 ? 1/12 : 0;
  const halfWedgeAngleSize = Math.PI / nTokens;
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
    const arcStart = (Math.PI * 2 * startPercentage);
    const arcStartInnerLine = arcStart + whitelineAngularModifier;
    const endPercentage = specialOffset + ((parseInt(tokenIndex) + 1) / nTokens);
    const arcEnd = (Math.PI * 2 * endPercentage)
    const arcEndInnerLine = arcEnd - whitelineAngularModifier;
    const toCenter = () => ctx.lineTo(xy, xy);
    const toOffsetCenter = (offsetRadius, offsetAngle, snap = false) => {
      const ox = xy + offsetX(offsetRadius, offsetAngle);
      const oy = xy + offsetY(offsetRadius, offsetAngle);
      const afterSnapX = snap ? snapToPx(ox) : ox;
      const afterSnapY = snap ? snapToPx(oy) : oy;
      ctx.lineTo(afterSnapX, afterSnapY);
    }
    const offsetX = (offsetRadius, offsetAngle) => {
      return offsetRadius * Math.cos(offsetAngle);
    }
    const offsetY = (offsetRadius, offsetAngle) => {
      return offsetRadius * Math.sin(offsetAngle);
    }
    const angleToMiddleOfWedge = (Math.PI * 2 * ((startPercentage + endPercentage) / 2));
    ctx.beginPath();
    // The inner point of the whiteline wedge is the point at which the outer edges of the black lines
    // for each of the two wedge straight edges meet. The blackline width is borderWidth
    // By simple trig, offset is hypotenuse of right-angle triangle, with angle being half the wedge angle
    // and opposite edge being of length half border width
    // Then add half the whiteline width to produce final offset for center-point of whiteline edges.
    const whitelineInternalOffset = (whitelineModifier / 2) + ((borderWidth/2) / Math.sin(halfWedgeAngleSize));
    toOffsetCenter(whitelineInternalOffset, angleToMiddleOfWedge);
    ctx.arc(xy, xy, radius - whitelineModifier,  arcStartInnerLine, arcEndInnerLine);
    toOffsetCenter(whitelineInternalOffset, angleToMiddleOfWedge);
    ctx.strokeStyle = '#f4f6ff';
    ctx.lineWidth = whitelineModifier;
    ctx.stroke();
  
    if (image && size >= 40) {
      // fill with image
      ctx.save();
      ctx.clip();
      const img = new Image();
      // Move the center of the image to the center of the wedge
      // Centroid of wedge size 2a radius r is 2r*sin(a)/3a
      const centroidDistance = 2 * radius * Math.sin(halfWedgeAngleSize)/ (3 * halfWedgeAngleSize)
      img.onload = () => ctx.drawImage(img, imageTL + offsetX(centroidDistance, angleToMiddleOfWedge), imageTL + offsetY(centroidDistance, angleToMiddleOfWedge), size, size);
      img.onerror = err => { throw new Error('Failed to load token image') };
      img.src = image;
      ctx.restore();
      tokenEdgeColour = color;
    } else {
      // fill with colour and label
      ctx.fillStyle = color;
      ctx.fill();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Reduce text size depending on number of tokens (i.e. more tokens => less space)
      ctx.font = `${fontsize * (0.9 ** nTokens)}px ${font}`;
      ctx.fillStyle = fontcolor;
      // Clip text to fit inside
      ctx.save();
      ctx.clip();
      ctx.fillText(label, xy + offsetX(radius * 0.5, angleToMiddleOfWedge), xy + offsetY(radius * 0.5, angleToMiddleOfWedge));
      ctx.restore();
    }
  
    // outer token edge
    ctx.beginPath();
    toCenter();
    ctx.arc(xy, xy, radius, arcStart, arcEnd);
    toCenter();
    ctx.strokeStyle = tokenEdgeColour;
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    if (hasSubLabel) {
      // Draw Label, then outline whole shape
      // The wedge for each subToken is defined by 3 points.
      // We align the sublabel with the 'rightmost' of the 2 non-center points (arc ends)
      // This point is on one of the corners. We determine which by determining
      // chirality with respect to center of the current wedge, positioning
      // the box in that direction

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${subLabelFontSize}px ${font}`;
      const arcStartCoords = [xy + offsetX(radius, arcStart), xy + offsetY(radius, arcStart)];
      const arcEndCoords = [xy + offsetX(radius, arcEnd), xy + offsetY(radius, arcEnd)];
      // Pick the "rightmost" point
      const useArcStart = arcStartCoords[0] > arcEndCoords[0];
      const boxOriginCorner = useArcStart ? arcStartCoords : arcEndCoords;
      const otherCoord = useArcStart ? arcEndCoords : arcStartCoords;
      const xParity = boxOriginCorner[0] - otherCoord[0] > 0 ? -1 : 1;
      const yParity = boxOriginCorner[1] - otherCoord[1] > 0 ? -1 : 1;
      const boxWidth = ctx.measureText("O").width + 2;
      const boxHeight = boxWidth;
      ctx.arc(xy, xy, 3*radius, arcStart, arcEnd);
      ctx.save();
      ctx.clip();
      ctx.beginPath();
      // ctx.rect(boxOriginCorner[0] - (2 * xParity), boxOriginCorner[1] - (2 * xParity), (boxWidth + 2) * xParity, (boxHeight + 2) * yParity);
      ctx.rect(boxOriginCorner[0], boxOriginCorner[1], boxWidth * xParity, boxHeight * yParity);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#f4f6ff';
      ctx.lineWidth = boxEdgeWidth;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = fontcolor;
      const useFullLabel = ctx.measureText(label).width < boxWidth;
      ctx.save();
      ctx.clip();
      ctx.fillText(useFullLabel ? label : subLabel, boxOriginCorner[0] + ((boxWidth * xParity)/2),  boxOriginCorner[1] + ((boxHeight * yParity)/2));
      ctx.restore();
    }
  }
}
