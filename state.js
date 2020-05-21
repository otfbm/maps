export default class State {
    constructor(width, height) {
        this.state = []

        for (let x = 0; x < width; x++) {
            let arr = [];
            for (let y = 0; y < height; y++) {
                arr[y] = null;
            }
            this.state[x] = arr;
        }
    }

    set(item) {
        this.state[item.x][item.y] = item;
    }

    get(x, y) {
        return this.state[x][y] || null;
    }

    [Symbol.iterator]() {
        let x = 0;
        let y = 0;
        return {
            next: () => {
                if (x < this.state.length || (y && y < this.state[x].length)) {
                    const value = { value: this.get(x, y), done: false };
                    if (y < this.state[x].length - 1) y++;
                    else {
                        x++;
                        y = 0;
                    }
                    return value;
                } else {
                    return { done: true };
                }
            }
        }
    }
}