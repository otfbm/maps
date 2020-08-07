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
    backgroundOffsetX = 0,
    backgroundOffsetY = 0,
    backgroundZoom = 1,
  } = {}) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.zoom = zoom;
    this.gridsize = gridsize;
    this.padding = padding;
    this.panX = panX;
    this.panY = panY;
    this.backgroundOffsetX = backgroundOffsetX;
    this.backgroundOffsetY = backgroundOffsetY;
    this.backgroundZoom = backgroundZoom;
  }
}
