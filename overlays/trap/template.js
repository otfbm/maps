module.exports = ({
  height,
  width,
  color,
}) => {
  const textY = height / 2 + 6;
  return `
    <svg height="${height}" width="${width}">
      <rect x="5" y="5" width="${width - 9}" height="${height - 9}" stroke="${color}" fill-opacity="0" />
      <text x="50%" y="${textY}" font-family="sans-serif" font-size="16" text-anchor="middle" fill="${color}">T</text>
    </svg>
  `;
}