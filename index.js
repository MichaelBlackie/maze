const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

let current;

class Maze {
    constructor(width, height, size){
        this.width = width;
        this.height = height;
        this.size = size;
        this.grid = [];
    }

    setup(){
        for(let x = 0; x < this.width; x++){
            let column = [];
            for(let y = 0; y < this.height; y++){
                column.push(new Cell({x: x, y: y}, true, this.size, {cols: this.width, rows: this.height}))
                column[y].draw()
            }
            this.grid.push(column)
        }
    }

    clearSquare(x, y){
        this.grid[x][y].filled = false;
        this.grid[x][y].draw()
    }
}

class Cell {
    constructor({x,y}, filled, parentSize, grid){
        this.x = x;
        this.y = y;
        this.rows = grid.rows
        this.cols = grid.cols
        this.filled = filled;
        this.parentSize = parentSize;
    }

    draw(){
        if (this.filled){
            ctx.fillStyle = "black"
            ctx.fillRect(this.parentSize/this.cols * this.x ,this.parentSize/ this.rows * this.y , this.parentSize/this.cols, this.parentSize/ this.rows)
        } else {
            ctx.fillStyle = "white"
            ctx.fillRect(this.parentSize/this.cols * this.x ,this.parentSize/ this.rows * this.y , this.parentSize/this.cols, this.parentSize/ this.rows)
        }
    }
}

maze = new Maze(10, 10, 500);
canvas.width = maze.size;
canvas.height = maze.size;
maze.setup()
maze.clearSquare(1,3)
