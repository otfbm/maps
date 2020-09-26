module.exports = ({
  height,
  width,
  radius,
  center,
  points,
  color,
}) => `
  <svg height="${height}" width="${width}">
    <circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="none" stroke="${color}" />
    <polygon points="${points}" fill="${color}" />
  </svg>
`;
