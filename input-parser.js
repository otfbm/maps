const lookups = new Map([
    ['g', 'forestgreen'],
    ['r', 'firebrick'],
    ['b', 'cornflowerblue'],
    ['y', 'gold'],
    ['p', 'darkviolet'],
    ['c', 'deepskyblue'],
    ['d', 'darkgoldenrod'],
    ['T', 'tiny'],
    ['S', 'small'],
    ['M', 'medium'],
    ['L', 'large'],
    ['H', 'huge'],
    ['G', 'gargantuan'],
]);

const colors = ['g', 'r', 'b', 'y', 'p', 'c', 'd'];
const sizes = ['T', 'S', 'M', 'L', 'H', 'G'];

export default class InputParser {
    constructor(params, query) {
        const path = params['*'];
        const parts = path.split('/');
        
        this.board = [10, 10];
        if (parts[0].includes('x')) {
            const first = parts.shift();
            this.board = this.parseBoard(first);
            this.tokens = this.parseTokens(parts);
        } else {
            this.tokens = this.parseTokens(parts);
        }

        const rooms = query.rooms || query.r;
        this.rooms = this.parseRooms(rooms);
        
        // const walls = query.walls || query.w;
        // this.walls = this.parseWalls(walls);

        // this.tokens = this.parseTokens(params.tokens);
    }

    parseBoard(board) {
        const [ width, height ] = board.split('x');
        return [parseInt(width, 10), parseInt(height, 10)];
    }

    parseRooms(rooms = '') {
        const r = [];
        if (!rooms) return r;
        for (const room of rooms.split('|')) {
            const [width, height] = room.split('x');
            r.push({ width: parseInt(width, 10), height: parseInt(height, 10) });
        }
        return r;
    }

    // parseWalls(walls = '') {
    //     const w = [];
    //     if (!walls) return w;
    //     for (const wall of walls.split('|')) {
    //         const [position, name, color] = token.split('-');
    //         t.push({
    //             name: name || '',
    //             position: position.split(',') || [],
    //             color: color || '',
    //         });
    //     }
    //     return w;
    // }

    parseTokens(tokens) {
        const tok = [];
        for (const token of tokens) {
            let [t, l] = token.split('-');
            const position = [t[0]];
            t = t.slice(1);
            if (Number.isNaN(parseInt(t[1],10))) {
                position.push(t[0]);
                t = t.slice(1);
            } else {
                position.push(parseInt(`${t[0]}${t[1]}`, 10));
                t = t.slice(2);
            }

            let color = ''
            if (colors.includes(t[0])) {
                color = lookups.get(t[0]);
            }

            if (colors.includes(t[1]) && !color) {
                color = lookups.get(t[1]);
            }

            let size = 'medium';
            if (sizes.includes(t[0])) {
                size = lookups.get(t[0]);
            }

            if (sizes.includes(t[1])) {
                size = lookups.get(t[1]);
            }            

            tok.push({
                name: l || '',
                position,
                color,
                size,
            });
        }
        return tok;
    }
}