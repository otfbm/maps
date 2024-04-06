const colourCodes = new Map([
  ["W", "#f4f6ff"], // white
  ["K", "#07031a"], // black
  ["E", "#808080"], // grey
  ["A", "#808080"], // grey
  ["R", "#e63c3c"], // red
  ["G", "#01c178"], // green
  ["B", "#1d7cbc"], // blue
  ["Y", "#fbd46e"], // yellow
  ["P", "#b75897"], // purple
  ["I", "#ffc1fa"], // pink
  ["C", "#62c1bf"], // cyan
  ["N", "#582f29"], // brown
  ["O", "#f08237"], // orange
  ["BK", "#07031a"], // black
  ["GY", "#808080"], // grey
  ["BN", "#582f29"], // brown
  ["PU", "#b75897"], // purple
  ["PK", "#ffc1fa"] // pink
]);

export default class ColourParser {
  /**
   * parse a colour
   * @param {string} str colour code 
   */
  static parse(str) {
    if (str) {
      var upper = str.toUpperCase();
      if (upper.charAt(0) === "~") {
        if (upper.length === 4)
          return "#" + upper.charAt(1) + upper.charAt(1) + upper.charAt(2) + upper.charAt(2) + upper.charAt(3) + upper.charAt(3);
        return "#" + upper.substr(1);
      }
      return colourCodes.get(upper) || "#07031a";  
    }
    return "#07031a";
  }
};
