module.exports = class GridsizeParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\@.*c([0-9]+).*$/
        const matches = trimmed.match(regex);
        
        if (matches) {
            const size = parseInt(matches[1], 10);

            // nasty hack to remove the match from the original options string
            str = str.replace(`c${matches[1]}`, '');
            
            if (!size) return false;
            return { size };
        }

        return false;
    }
}