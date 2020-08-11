module.exports = class DarkModeParser {
    parse(str) {
        return /^@.*d.*$/.test(str);
    }
}