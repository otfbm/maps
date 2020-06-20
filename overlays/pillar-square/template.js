export default ({
  height,
  width,
}) => {
  return `
    <svg height="${height}" width="${width}">
      <rect x="5" y="5" width="${width - 9}" height="${height - 9}" fill="black" />
    </svg>
  `;
}