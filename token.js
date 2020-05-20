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
    constructor({name, position, color, size, ctx, gridsize, padding}) {
        this.name = name;
        this.left = this.fromLetter(position[0]);
        this.top = position[1];
        this.ctx = ctx;
        this.gridsize = gridsize;
        this.padding = padding;
        this.color = color || 'black';
        this.size = sizes.get(size).size;
        this.offset = sizes.get(size).offset;
    }

    fromLetter(letter) {
        return letters.get(letter.toLowerCase());
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'black';
        this.ctx.arc(
            this.padding + (this.gridsize * this.offset) + (this.left - 1) * this.gridsize,
            this.padding + (this.gridsize * this.offset) + (this.top - 1) * this.gridsize, 
            this.gridsize * this.size, // radius is half the gridsize
            0, 
            2 * Math.PI,
        );
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'slategrey';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            this.name, 
            this.padding + (this.gridsize * this.offset) + (this.left - 1) * this.gridsize,
            this.padding + (this.gridsize * this.offset) + (this.top - 1) * this.gridsize, 
        );
        this.ctx.stroke();
    }
}