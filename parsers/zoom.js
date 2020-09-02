module.exports = class ZoomParser {
    parse(obj) {
        let match = obj.str.match(/^@[^0-9.]*([0-9](\.[0-9]{1,3})?|\.[0-9]{1,3})/);
        if (match) {
            let zoom = Number(match[1]);
            return zoom <= 3 ? zoom : 3;
        }
        return false;
    }
}
