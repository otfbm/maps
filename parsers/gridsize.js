module.exports = class GridsizeParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\*([0-9]*)(:([0-9]*))?(:([0-9]*))?$/
        const matches = trimmed.match(regex);
        
        if (matches) {
            const size = parseInt(matches[1]);
            const x = parseInt(matches[3]);
            const y = parseInt(matches[5]);

            if (!size) return false;

            const result = { size };

            if (!Number.isNaN(x)) {
                result.x = x;
            }

            if (!Number.isNaN(y)) {
                result.y = y;
            }

            return result;
        }

        return false;
    }
}