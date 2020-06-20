export default ({
  height,
  width,
}) => `
  <svg height="${height}" width="${width}">
    <rect x="5" y="5" width="${width - 9}" height="${height - 9}" fill="none" stroke="black" />
    <path d="M5 5 L ${width - 5} ${height - 5}" stroke="black" fill="none" />
    <path d="M${width - 5} 5 L 5 ${height - 5}" stroke="black" fill="none" />
    <rect x="10" y="10" width="${width - 19}" height="${height - 19}" fill="black" stroke="none" />
  </svg>
`;
