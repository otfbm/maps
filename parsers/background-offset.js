module.exports = class BackgroundOffsetParser {
    parse(obj) {
        let trimmed = obj.str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\@.*o([0-9]+):([0-9]+).*$/
        const matches = trimmed.match(regex);
        
        if (matches) {
            const x = parseInt(matches[1], 10);
            const y = parseInt(matches[2], 10);

            if (Number.isNaN(x) || Number.isNaN(x)) return false;

            // nasty hack to remove the match from the original options string
            obj.str = obj.str.replace(`o${matches[1]}:${matches[2]}`, '');

            return { x, y };
        }

        return false;
    }
}