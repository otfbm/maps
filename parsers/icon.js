const icons = new Map([
  ["$D", "./icons/doorway.svg"],
]);

export default class IconParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, trimmed.length - 1);

    if (str.length < 4) return false;

    // a string matching a token definition eg. D3rp-asdsa
    const reg = /^([A-Za-z][0-9][0-9]?)(\$[A-Za-z])$/;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);

      const coords = matches[1] || "";
      const code = (coords[0] || "").charCodeAt(0);
      let x;
      if (code > 64 && code < 91) {
        x = code - 64;
      } else {
        x = code - 70;
      }

      const icon = icons.get(matches[2]);

      return {
        x,
        y: parseInt(coords.substr(1) || "", 10),
        icon,
      };
    }

    return false;
  }
}
