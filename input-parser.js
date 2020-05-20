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
        const t = [];
        for (const token of tokens) {
            const [flags, name] = token.split('-');

            let color = ''
            if (colors.includes(flags[2])) {
                color = lookups.get(flags[2]);
            }

            if (colors.includes(flags[3]) && !color) {
                color = lookups.get(flags[3]);
            }

            let size = 'medium';
            if (sizes.includes(flags[2])) {
                size = lookups.get(flags[2]);
            }

            if (sizes.includes(flags[3])) {
                size = lookups.get(flags[3]);
            }

            t.push({
                name: name || '',
                position: [flags[0], flags[1]],
                color,
                size,
            });
        }
        return t;
    }
}