export default class LineParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed.charAt(0) !== '_') 
      return false;
 
    let result = [];

    for (const lineStr of trimmed.substr(1).split("_")) {
      let coords = this.parseCoords(lineStr)
      if (coords.length)
        result.push(coords);
    }
    
    if (result.length)
      return result;
    return false;
  }

  parseCoords(str) {
    const reg = /[A-Z][0-9][0-9]?/g;
    let result = [];
    let coords = str.match(reg) || [];
    for (const pt of coords) {
      const code = (pt[0] || "").charCodeAt(0);
      
      let x;
      if (code > 64 && code < 91) {
        x = code - 65;
      } else {
        x = code - 71;
      }

      result.push( {
        x,
        y: parseInt(pt.substr(1) || "", 10) - 1,
      });
    }

    return result;
  }
}