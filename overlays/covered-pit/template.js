module.exports = ({
  height,
  width,
  color,
}) => `
  <svg height="${height}" width="${width}">
    <rect x="5" y="5" width="${width - 9}" height="${height - 9}" fill="none" stroke="${color}" />
    <path d="M5 5 L ${width - 5} ${height - 5}" stroke="${color}" fill="none" />
    <path d="M${width - 5} 5 L 5 ${height - 5}" stroke="${color}" fill="none" />
  </svg>
`;
