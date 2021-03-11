module.exports = class Line {

  /**
   * @typedef {Object} Point
   * @property {number} x
   * @property {number} y
   */

  /**
   * Find a point between a and b.
   * @param {Point} a - Start point.
   * @param {Point} b - End point.
   * @param {number} t - distance from a as a fraction.
   * @return {Point} the point.
   */
  static pointOnLine(a, b, t) {
    return {
      x: (1 - t) * a.x + t * b.x,
      y: (1 - t) * a.y + t * b.y
    }
  }

  /**
   * Find the intersection of two lines.
   * @param {Point} a0 - Start point.
   * @param {Point} a1 - End point.
   * @param {Point} b0 - Start point.
   * @param {Point} b1 - End point.
   * @return {Point} The point of intersection (null if no intersection).
   */
  static lineIntersection(a0, a1, b0, b1) {
    let a2 = { x: a1.x - a0.x, y: a1.y - a0.y };
    let b2 = { x: b1.x - b0.x, y: b1.y - b0.y };

    let determinate = -b2.x * a2.y + a2.x * b2.y;
    let s = (-a2.y * (a0.x - b0.x) + a2.x * (a0.y - b0.y)) / determinate;
    let t = (b2.x * (a0.y - b0.y) - b2.y * (a0.x - b0.x)) / determinate;

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Collision detected
      return { x: a0.x + (t * a2.x), y: a0.y + (t * a2.y) };
    }

    return null;
  }
}
