const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const sliderUnit = document.getElementById("sizeSlider");

class Maze {
    constructor(width, height, size){
        this.width = width;
        this.height = height;
        this.size = size;
        this.grid = [];
    }

    setup(){
        this.grid = []
        for(let x = 0; x < this.width; x++){
            let column = [];
            for(let y = 0; y < this.height; y++){
                column.push(new Cell({x: x, y: y}, this.size, {cols: this.width, rows: this.height}))
            }
            this.grid.push(column)
        }
        let endx = this.width
        let endy = this.height
        this.grid[0][0].fill("green")
        this.grid[this.width - 1][this.height - 1].fill("red")
    }
}

class Cell {
    constructor({x,y}, parentSize, grid){
        this.x = x;
        this.y = y;
        this.rows = grid.rows
        this.cols = grid.cols
        this.parentSize = parentSize;
        this.xCoord = this.x * (this.parentSize / this.cols)
        this.yCoord = this.y * (this.parentSize / this.rows)
    }

    rightWall(){
        ctx.moveTo(this.xCoord + this.parentSize/this.cols, this.yCoord)
        ctx.lineTo(this.xCoord + this.parentSize/this.cols, this.yCoord + this.parentSize/this.rows)
        ctx.stroke()
    }

    bottomWall(){
        ctx.moveTo(this.xCoord + this.parentSize/this.cols, this.yCoord + this.parentSize/this.rows)
        ctx.lineTo(this.xCoord, this.yCoord + this.parentSize/this.rows)
        ctx.stroke()
    }

    leftWall(){
        ctx.moveTo(this.xCoord, this.yCoord + this.parentSize/this.rows)
        ctx.lineTo(this.xCoord, this.yCoord)
        ctx.stroke()
    }

    topWall(){
        ctx.moveTo(this.xCoord, this.yCoord)
        ctx.lineTo(this.xCoord + this.parentSize/this.cols, this.yCoord)
        ctx.stroke()
    }

    fill(color){
        ctx.fillStyle = color
        ctx.fillRect(this.xCoord, this.yCoord, this.parentSize/this.cols, this.parentSize/this.rows)
    }
}

function generateBinaryTreeMaze(){
    maze = new Maze(parseInt(sliderUnit.value), parseInt(sliderUnit.value), 500);
    canvas.width = maze.size;
    canvas.height = maze.size;
    maze.setup()
    let start = maze.grid[maze.width - 1][maze.height - 1]
    for (let y = start.y; y >= 0; y--){
        console.log("y")
        for (let x = start.x; x >= 0; x--){
            console.log("x")
            if (x > 0 && y > 0){
                if (Math.random() > 0.5){
                    carve("north", maze.grid[x][y])
                } else {
                    carve("west", maze.grid[x][y])
                }
            } else if (x == 0){
                carve("north", maze.grid[x][y])
            } else {
                carve("west", maze.grid[x][y])
            }
        }
    }
}

function carve(direction, cell){
    if (direction === "north"){
        cell.leftWall()
    } else if (direction === "west"){
        cell.topWall()
    }
}