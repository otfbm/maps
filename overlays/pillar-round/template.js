module.exports = ({
  height,
  width,
  color,
}) => {
  const shortest = width < height ? width : height;
  return `
    <svg height="${height}" width="${width}">
      <circle cx="50%" cy="50%" r="${shortest / 2 - 5}" fill="${color}" />
    </svg>
  `;
}