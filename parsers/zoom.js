module.exports = class ZoomParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        let match = trimmed.match(/[0-9](.[0-9]{1,3})?/);
        if (match)
            return Number(match[0]);

        return false;
    }
}
