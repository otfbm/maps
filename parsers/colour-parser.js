const colourCodes = new Map([
  ["W", "#ffffff"], // white
  ["K", "#000000"], // black
  ["E", "#808080"], // grey
  ["A", "#808080"], // grey
  ["R", "#e63c3c"], // red
  ["G", "#01c178"], // green
  ["B", "#1d7cbc"], // blue
  ["Y", "#fbd46e"], // yellow
  ["P", "#b75897"], // pink
  ["C", "#62c1bf"], // cyan
  ["N", "#582f29"], // brown
  ["O", "#f08237"], // orange
  ["BK", "#000000"], // black
  ["GY", "#808080"], // grey
  ["BN", "#582f29"] // brown
]);

module.exports = class ColourParser {
  /**
   * parse a colour
   * @param {string} str colour code 
   */
  static parse(str) {
    if (str) {
      var upper = str.toUpperCase();
      if (upper.charAt(0) === "~")
        return "#" + upper.substr(1);
      return colourCodes.get(upper) || "black";  
    }
    return "black";
  }
}
