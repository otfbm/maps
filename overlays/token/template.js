module.exports = ({
  size,
  color,
  fontsize,
  label
}) => `
<svg height="${size}" width="${size}" font-family="FleischWurst">
  <circle cx="50%" cy="50%" r="47%" fill="${color}" stroke="white" stroke-width="3.5%"/>
  <circle cx="50%" cy="50%" r="48%" fill="none" stroke="black" stroke-width="2.5%" />
  <text dy=".3em" x = "50%" y = "50%" text-anchor="middle" fill="white" font-family="FleischWurst" font-size="${fontsize}">${label}</text>
</svg>
`;
