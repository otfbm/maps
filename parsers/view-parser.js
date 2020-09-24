const CoordParser = require("./coord-parser.js");

module.exports = class ViewParser {
    parse(str) {
        let match = str.match(/^([A-Z]{1,2}[0-9]{1,2}):([A-Z]{1,4}[0-9]{1,2})$/i);
        if (match) {
            let pan = CoordParser.parse(match[1]);
            pan.x--;
            pan.y--;
            let bottomRight = CoordParser.parse(match[2]);
            return { width: bottomRight.x - pan.x, height: bottomRight.y - pan.y, panX: pan.x, panY: pan.y };
        }

        match = str.match(/^(([A-Z]{1,2}[0-9]{1,2}):)?([1-9][0-9]?)x([1-9][0-9]?)$/i);
        if (match) {
            let pan = { x: 0, y: 0 };
            if (match[2]) {
                pan = CoordParser.parse(match[2]);
                pan.x--;
                pan.y--;
            }
            let width = parseInt(match[3]);
            let height = parseInt(match[4]);
            return { width, height, panX: pan.x, panY: pan.y };
        }

        return false;
    }
}
