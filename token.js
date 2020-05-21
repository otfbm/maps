const letters = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
    ['e', 5],
    ['f', 6],
    ['g', 7],
    ['h', 8],
    ['i', 9],
    ['j', 10],
    ['k', 11],
    ['l', 12],
    ['m', 13],
    ['n', 14],
    ['o', 15],
    ['p', 16],
    ['q', 17],
    ['r', 18],
    ['s', 19],
    ['t', 20],
    ['u', 21],
    ['v', 22],
    ['w', 23],
    ['x', 24],
    ['y', 25],
    ['z', 26],
]);

const sizes = new Map([
    ['tiny', { offset: 0.5, size: 0.25 }],
    ['small', { offset: 0.5, size: 0.5 }],
    ['medium', { offset: 0.5, size: 0.5 }],
    ['large', { offset: 1, size: 1 }],
    ['huge', { offset: 1.5, size: 1.5 }],
    ['gargantuan', { offset: 2, size: 2 }],
]);

export default class Token {
    constructor({name, x, y, color, size, ctx, gridsize, padding}) {
        this.name = name;
        this.x = this.fromLetter(x);
        this.y = parseInt(y, 10);
        this.color = color || 'black';
        this.size = sizes.get(size).size;
        this.offset = sizes.get(size).offset;
    }

    fromLetter(letter) {
        return letters.get(letter.toLowerCase());
    }

    draw(ctx, gridsize, padding) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.arc(
            padding + (gridsize * this.offset) + (this.x - 1) * gridsize,
            padding + (gridsize * this.offset) + (this.y - 1) * gridsize, 
            gridsize * this.size, // radius is half the gridsize
            0, 
            2 * Math.PI,
        );
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'slategrey';
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.name, 
            padding + (gridsize * this.offset) + (this.x - 1) * gridsize,
            padding + (gridsize * this.offset) + (this.y - 1) * gridsize, 
        );
        ctx.stroke();
    }
}