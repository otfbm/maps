import Token from "./token.js";
import BoardParser from './parsers/board.js'
import TokenParser from './parsers/token.js'

export default class InputParser {
  constructor(pathname = "") {
    let parts = [];
    this.board = { width: 10, height: 10 };
    this.tokens = [];

    // trim off leading /
    if (pathname[0] === "/") parts = pathname.substr(1)
    // trim of trailing /
    if (pathname[pathname.length - 1] === "/") pathname.substr(0, pathname.length - 1);
    parts = pathname.split("/");

    const boardParser = new BoardParser();
    const tokenParser = new TokenParser();

    for (const part of parts) {
      let parsed = boardParser.parse(part);
      if (parsed) this.board = parsed;

      parsed = tokenParser.parse(part);
      if (parsed) this.tokens.push({ x: parsed.x, y: parsed.y, item: new Token(parsed) });

      // Extend by adding more parsers here
    } 
  }
}
