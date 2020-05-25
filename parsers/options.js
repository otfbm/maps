export default class OptionsParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        /* if his segment is prefaced with a !, we know we're parsing options */
        if ( trimmed[0] == '!' ) {
            var opacity = 1.0;

            /* For parsing gridline opacity, check for the existence of a 'g' character 
               followed by a number 1-100. */
            if (trimmed.includes('gh')) {
                opacity = 0.5;
            }
            else if (trimmed.includes('gt')){
                opacity = 0.0;
            }

            return {
                darkMode: trimmed.includes('d'),
                gridOpacity: opacity,
            }
        }

        return false;
    }
}