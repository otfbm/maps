const p = 10;

const letters = new Map([
    [1, 'A'],
    [2, 'B'],
    [3, 'C'],
    [4, 'D'],
    [5, 'E'],
    [6, 'F'],
    [7, 'G'],
    [8, 'H'],
    [9, 'I'],
    [10, 'J'],
    [11, 'K'],
    [12, 'L'],
    [13, 'M'],
    [14, 'N'],
    [15, 'O'],
    [16, 'P'],
    [17, 'Q'],
    [18, 'R'],
    [19, 'S'],
    [20, 'T'],
    [21, 'U'],
    [22, 'V'],
    [23, 'W'],
    [24, 'X'],
    [25, 'Y'],
    [26, 'Z'],
]);

export default class Board {
    constructor({ width, height, gridsize, padding, ctx, strokeStyle = "#CCCCCC" }) {
        this.width = width;
        this.height = height;
        this.gridsize = gridsize;
        this.ctx = ctx;
        this.padding = padding;
        this.strokeStyle = strokeStyle;
    }

    draw() {
        this.ctx.beginPath();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width * this.gridsize, this.height * this.gridsize);

        for (let i = 0; i <= this.width; i += this.gridsize) {
            // this.ctx.beginPath();
            this.ctx.moveTo(0.5 + i + this.padding, this.padding);
            this.ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();

            const num = i / this.gridsize;
            if (num < 1) continue;
            this.ctx.beginPath();
            this.ctx.fillStyle = 'slategray';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                letters.get(num),
                this.padding + i - (this.gridsize / 2),
                this.padding - 5,
            );
        }
    
        for (let i = 0; i <= this.height; i += this.gridsize) {
            this.ctx.moveTo(this.padding, 0.5 + i + this.padding);
            this.ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.fillStyle = 'slategray';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const num = i / this.gridsize
            if (num < 1) continue;
            this.ctx.fillText(
                String(num),
                this.padding - 7,
                this.padding + i - (this.gridsize / 2),
            );
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = 'slategray';
        this.ctx.fillText(
            '1 square = 5ft', 
            this.width - this.padding - 10,
            this.height + this.padding + 7,
        );
    }
}