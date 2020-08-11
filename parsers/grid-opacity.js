module.exports = class GridOpacityParser {
    parse(str) {
        if (/^@.*h.*$/.test(str))
            return 0.5;
        if (/^@.*n.*$/.test(str))
            return 0.0;

        return null;
    }
}