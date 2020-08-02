module.exports = class GridsizeParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\*([0-9]*)$/
        const matches = str.match(regex);
        if (matches) {
            return parseInt(matches[1]);
        }
    }
}