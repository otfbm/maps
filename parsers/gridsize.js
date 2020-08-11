module.exports = class GridsizeParser {
    parse(obj) {
        const regex = /^\@.*c([0-9]+).*$/
        const matches = obj.str.match(regex);
        
        if (matches) {
            let size = parseInt(matches[1], 10);

            // min grid size
            if (size < 20) size = 20;
            if (size > 100) size = 100;

            // nasty hack to remove the match from the original options string
            obj.str = obj.str.replace(`c${matches[1]}`, '');
            
            if (!size) return false;
            return { size };
        }

        return false;
    }
}