export default class Options {
  constructor({
    width = 400,
    height = 400,
    depth = 5,
    zoom = 1,
    gridsize = 40,
    padding = 15,
  } = {}) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.zoom = zoom;
    this.gridsize = gridsize;
    this.padding = padding;
  }
}
