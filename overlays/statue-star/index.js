import template from "./template.js";

export default class StatueOverlay {
  constructor(options) {
    this.options = options;
  }

  get name() {
    return "statue-star";
  }

  circlePoints(points, radius, center) {
    const slice = (2 * Math.PI) / points;
    const xys = [];
    for (let i = 0; i < points; i++) {
      const angle = slice * i - Math.PI / 2;
      const newX = center.x + radius * Math.cos(angle);
      const newY = center.y + radius * Math.sin(angle);
      xys.push([newX, newY]);
    }
    return xys;
  }

  render(cell) {
    const width = cell.overlay.width;
    const height = cell.overlay.height;
    const shortest = width < height ? width : height;
    const radius = shortest / 2 - 5;
    const center = { x: width / 2, y: height / 2 };
    const cp = this.circlePoints(5, radius, center)
    const points = [cp[0], cp[3], cp[1], cp[4], cp[2]].map(p => p.join(',')).join(' ');

    const svg = template({
      height,
      width,
      radius,
      center,
      points,
    });
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}
