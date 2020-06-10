const charOffset = 64; // y coordinates start at A

export default class CoordParser {
  /**
   * convert excel style coordinates to x,y
   * @param {string} coord 
   */
  static parse(str) {
    var upper = str.toUpperCase();
    let x = upper.charCodeAt(0) - charOffset;

    const reg = /[A-Z]/;
    let yIndex = 1;
    if (upper[1].match(reg)) {
      x = x * 26 + upper.charCodeAt(1) - charOffset;
      yIndex = 2;
    }

    return {
      x,
      y: parseInt(str.substr(yIndex) || "", 10)
    }
  }

  static parseSet(str) {
    const reg = /[A-Za-z][A-Za-z]?[0-9][0-9]?/g;
    let result = [];
    const coords = str.match(reg) || [];
    for (const m of coords) {
      result.push(this.parse(m));
    }
    return result;
  }
}