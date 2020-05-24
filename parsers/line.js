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
    const reg = /(\$[a-zA-Z])?[a-zA-Z][0-9][0-9]?/g;
    let result = [];
    let coords = str.match(reg) || [];
    for (const pt of coords) {
      let i = 0;
      let icon = "";
      if (pt.charAt(0) === '$') {
        i = 2;
        icon = pt.charAt(1);
      }

      const code = (pt[i] || "").charCodeAt();
      
      let x;
      if (code > 64 && code < 91) {
        x = code - 65;
      } else {
        x = code - 71;
      }

      result.push( {
        x,
        y: parseInt(pt.substr(i + 1) || "", 10) - 1,
        icon
      });
    }

    return result;
  }
}