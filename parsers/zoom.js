export default class ZoomParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        // a zoom value between #1 and #3
        if (/^@[1-3]$/.test(trimmed)) {
            return parseInt(trimmed.substr(1), 10);
        }

        return false;
    }
}