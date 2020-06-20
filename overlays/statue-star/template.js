export default ({
  height,
  width,
  radius,
  center,
  points,
}) => `
  <svg height="${height}" width="${width}">
    <circle cx="${center.x}" cy="${center.y}" r="${radius}" fill="none" stroke="black" />
    <polygon points="${points}" fill="black" />
  </svg>
`;
