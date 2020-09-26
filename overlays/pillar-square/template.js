module.exports = ({
  height,
  width,
  color,
}) => {
  return `
    <svg height="${height}" width="${width}">
      <rect x="5" y="5" width="${width - 9}" height="${height - 9}" fill="${color}" />
    </svg>
  `;
}