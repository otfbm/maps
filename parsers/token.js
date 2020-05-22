const flagLookups = new Map([
  ["g", "forestgreen"],
  ["r", "firebrick"],
  ["b", "cornflowerblue"],
  ["y", "gold"],
  ["p", "darkviolet"],
  ["c", "deepskyblue"],
  ["d", "darkgoldenrod"],
  ["T", "tiny"],
  ["S", "small"],
  ["M", "medium"],
  ["L", "large"],
  ["H", "huge"],
  ["G", "gargantuan"],
]);

const sizes = ['T', 'S', 'M', 'L', 'H', 'G'];
const colors = ['g', 'r', 'b', 'y', 'p', 'c', 'd'];

export default class TokenParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, length - 1);
    if (str.length < 2) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Za-z][0-9][0-9]?)([grbypcdTSMLHG]?[grbypcdTSMLHG]?)(-([A-Za-z]*))?$/;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);

      let color = 'black';
      let size = 'medium';
      for (const char of matches[2] || "") {
        if (colors.includes(char)) color = flagLookups.get(char);
        if (sizes.includes(char)) size = flagLookups.get(char);
      }

      const coords = matches[1] || "";
      const code = (coords[0] || "").charCodeAt(0);
      let x;
      if (code > 64 && code < 91) {
        x = code - 64;
      } else {
        x = code - 70;
      }

      return {
        x,
        y: parseInt(coords.substr(1) || "", 10),
        color,
        size,
        name: matches[4] || "",
      };
    }

    return false;
  }
}
