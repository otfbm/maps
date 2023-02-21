export default ({
  height,
  width,
  color,
}) => `
  <svg height="${height}" width="${width}" viewBox="0 0 512 512">
    <path d="M41 265v30h430v-30H41zm39 48v158.066h32V313H80zm320 0v158.066h32V313h-32z" fill="${color}" fill-opacity="1" />
  </svg>
`;
