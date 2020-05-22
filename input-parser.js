import BoardParser from './parsers/board.js';
import TokenParser from './parsers/token.js';
import IconParser from './parsers/icon.js';
import Token from "./token.js";
import Icon from "./icon.js";

export default class InputParser {
  constructor(pathname = "") {
    let parts = [];
    this.board = { width: 10, height: 10 };
    this.tokens = [];
    this.icons = [];

    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1)
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/") pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    const boardParser = new BoardParser();
    const tokenParser = new TokenParser();
    const iconParser = new IconParser();

    for (const part of parts) {
      let parsed = boardParser.parse(part);
      if (parsed) this.board = parsed;

      parsed = tokenParser.parse(part);
      if (parsed) this.tokens.push({ x: parsed.x, y: parsed.y, item: new Token(parsed) });

      parsed = iconParser.parse(part);
      if (parsed) this.icons.push({ x: parsed.x, y: parsed.y, item: new Icon(parsed) });

      // Extend by adding more parsers here
    } 
  }
}
