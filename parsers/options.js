export default class OptionsParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        /* if his segment is prefaced with a 'opt=', we know we're parsing options */
        if ( trimmed.substr(0, 4) === 'opt=' ) {
            var opacity = 1.0;

            if (trimmed.includes('gh'))
                opacity = 0.5;
            else if (trimmed.includes('g0'))
                opacity = 0.0;

            return {
                darkMode: trimmed.includes('d'),
                gridOpacity: opacity,
            }
        }

        return false;
    }
}