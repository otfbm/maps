export default ({
  height,
  width,
}) => {
  const textY = height / 2 + 6;
  return `
    <svg height="${height}" width="${width}">
      <rect x="5" y="5" width="${width - 10}" height="${height - 10}" stroke="black" fill-opacity="0" />
      <text x="50%" y="${textY}" font-family="sans-serif" font-size="16" text-anchor="middle" fill="black">T</text>
    </svg>
  `;
}