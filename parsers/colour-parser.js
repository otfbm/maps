const colourCodes = new Map([
  ["W", "white"],
  ["K", "black"],
  ["E", "grey"],
  ["A", "gray"],
  ["R", "firebrick"],
  ["G", "forestgreen"],
  ["B", "cornflowerblue"],
  ["Y", "gold"],
  ["P", "darkviolet"],
  ["C", "deepskyblue"],
  ["N", "darkgoldenrod"],
  ["O", "orange"],
  ["BK", "black"],
  ["GY", "grey"],
  ["BN", "darkgoldenrod"]
]);

export default class ColourParser {
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
