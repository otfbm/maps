module.exports = class OpaqueEdgeParser {
    parse(str) {
        if (/^@.*e.*$/.test(str))
            return 1;
        return null;
    }
}