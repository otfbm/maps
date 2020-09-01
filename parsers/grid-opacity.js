module.exports = class GridOpacityParser {
    parse(str) {
        if (/^@.*n.*$/.test(str))
            return 0.0;
        return null;
    }
}