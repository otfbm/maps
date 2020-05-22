import Token from "./token.js";

const lookups = new Map([
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

const colors = ["g", "r", "b", "y", "p", "c", "d"];
const sizes = ["T", "S", "M", "L", "H", "G"];

export default class InputParser {
  constructor(pathname = "") {
    let parts = [];
    this.board = [10, 10];
    this.tokens = [];

    if (pathname[0] === "/") parts = pathname.substr(1).split("/");
    else parts = pathname.split("/");

    if (parts[0].includes("x")) {
      const first = parts.shift();
      this.board = this.parseBoard(first);

      if (!parts[0]) return;
      this.tokens = this.parseTokens(parts);
    } else {
      if (!parts[0]) return;
      this.tokens = this.parseTokens(parts);
    }
  }

  parseBoard(board) {
    const [width, height] = board.split("x");
    return [parseInt(width, 10), parseInt(height, 10)];
  }

  parseRooms(rooms = "") {
    const r = [];
    if (!rooms) return r;
    for (const room of rooms.split("|")) {
      const [width, height] = room.split("x");
      r.push({ width: parseInt(width, 10), height: parseInt(height, 10) });
    }
    return r;
  }

  fromLetter(letter = "") {
    if (letter) {
        const code = letter.charCodeAt(0);
        if (code > 64 && code < 91) {
            return code - 64;
        } else {
            return code - 70;
        }
    }
    return null;
  }

  parseTokens(tokens) {
    const tok = [];
    for (const token of tokens) {
      let [t, l] = token.split("-");
      const position = [t[0]];
      t = t.slice(1);
      if (Number.isNaN(parseInt(t[1], 10))) {
        position.push(t[0]);
        t = t.slice(1);
      } else {
        position.push(parseInt(`${t[0]}${t[1]}`, 10));
        t = t.slice(2);
      }

      let color = "";
      if (colors.includes(t[0])) {
        color = lookups.get(t[0]);
      }

      if (colors.includes(t[1]) && !color) {
        color = lookups.get(t[1]);
      }

      let size = "medium";
      if (sizes.includes(t[0])) {
        size = lookups.get(t[0]);
      }

      if (sizes.includes(t[1])) {
        size = lookups.get(t[1]);
      }

      tok.push({
        x: this.fromLetter(position[0]),
        y: parseInt(position[1], 10),
        item: new Token({ name: l || "", color, size }),
      });
    }
    return tok;
  }
}
