export default ({
  height,
  width,
  radius,
  color,
  strokeWidth,
  fontsize,
  label,
}) => `
<svg height="${height}" width="${width}">
  <circle cx="50%" cy="50%" r="${radius}" fill="${color}" stroke="black" stroke-width="${strokeWidth}" />
  <text fill="white" x="49%" y="57%" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${label}</text>
</svg>
`;
