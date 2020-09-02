module.exports = class GridOpacityParser {
    parse(obj) {
        if (/^@.*n.*$/.test(obj.str))
            return 0.0;

        let matches = obj.str.match(/^@.*h([0-9]+)?.*$/);
        if (matches) {
            if (matches[1]) {
                // nasty hack to remove the match from the original options string
                obj.str = obj.str.replace(`h${matches[1]}`, '');

                let opacity = Number(matches[1].substr(0,3));
                return opacity <= 100 ? opacity / 100 : 1;
            }
            return 0.25;
        }
        return null;
    }
}
