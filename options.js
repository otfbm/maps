module.exports = class Options {
  constructor({
    width = 400,
    height = 400,
    depth = 5,
    zoom = 1,
    gridsize = 40,
    padding = 15,
    panX = 0,
    panY = 0,
  } = {}) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.zoom = zoom;
    this.gridsize = gridsize;
    this.padding = padding;
    this.panX = panX;
    this.panY = panY;
  }
}
