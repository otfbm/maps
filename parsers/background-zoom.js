module.exports = class BackgroundOffsetParser {
    parse(obj) {
        let trimmed = obj.str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\@.*z([0-9](\.[0-9]{1,3})?|\.[0-9]{1,3}).*$/
        const matches = trimmed.match(regex);
        
        if (matches) {
            const zoom = parseFloat(matches[1], 10);

            if (Number.isNaN(zoom)) return false;

            // nasty hack to remove the match from the original options string
            obj.str = obj.str.replace(`c${matches[1]}`, '');

            return zoom;
        }

        return false;
    }
}