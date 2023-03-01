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
        this.visited = false;
        this.walls = {
            left: true,
            right: true,
            bottom: true,
            top: true
        }
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


// Code for binary tree generator
function generateBinaryTreeMaze(){
    const t0 = performance.now();
    maze = new Maze(parseInt(sliderUnit.value), parseInt(sliderUnit.value), 500);
    canvas.width = maze.size;
    canvas.height = maze.size;
    maze.setup()
    let start = maze.grid[maze.width - 1][maze.height - 1]
    for (let y = start.y; y >= 0; y--){
        for (let x = start.x; x >= 0; x--){
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
    const t1 = performance.now();
    console.log(`Generated ${maze.width} by ${maze.height} maze using binary tree algorithm`)
    console.log(`Generation took ${t1 - t0} milliseconds.`);
    displayWalls()
}

function carve(direction, cell){
    if (direction === "north"){
        cell.walls.right = false;
        cell.walls.top = false;
        cell.walls.bottom = false;
    } else if (direction === "west"){
        cell.walls.right = false;
        cell.walls.left = false;
        cell.walls.bottom = false;
    }
}


// code for hunt and kill generator

function moveUp(x,y){
    console.log(maze.grid[x][y])
    maze.grid[x][y].walls.top = false;
    maze.grid[x][y - 1].walls.bottom = false;
}

function moveRight(x,y){
    console.log(maze.grid[x][y])
    maze.grid[x][y].walls.right = false;
    maze.grid[x + 1][y].walls.left = false;
}

function moveDown(x,y){
    console.log(maze.grid[x][y])
    maze.grid[x][y].walls.bottom = false;
    maze.grid[x][y + 1].walls.top = false;
}

function moveLeft(x,y){
    console.log(maze.grid[x][y])
    maze.grid[x][y].walls.left = false;
    maze.grid[x - 1][y].walls.right = false;
}

function walk(start){
    start.visited = true
    let affectedCell = null;
    let options = []

    try{
        let topNotVisited = (maze.grid[start.x][start.y - 1].visited != true)
        let bottomNotVisited = (maze.grid[start.x][start.y + 1].visited != true)
        let rightNotVisited = (maze.grid[start.x + 1][start.y].visited != true)
        let leftNotVisited = (maze.grid[start.x - 1][start.y].visited != true)

        if (topNotVisited){
            options.push({cell: maze.grid[start.x][start.y - 1], direction: "up"})
        } if (bottomNotVisited){
            options.push({cell: maze.grid[start.x][start.y + 1], direction: "down"})
        } if (rightNotVisited){
            options.push({cell: maze.grid[start.x + 1][start.y], direction: "right"})
        } if (leftNotVisited){
            options.push({cell: maze.grid[start.x - 1][start.y], direction: "left"})
        } else if (!leftNotVisited && !rightNotVisited && !bottomNotVisited && !topNotVisited){
            return "Finished"
        }
    } catch {
        return "Finished"
    }
    

    let randomChoice = options[Math.floor(Math.random() * options.length)]
    switch (randomChoice.direction){
        case "up":
            moveUp(start.x, start.y)
            walk(randomChoice.cell)
            break
        case "down":
            moveDown(start.x, start.y)
            walk(randomChoice.cell)
            break
        case "right":
            moveRight(start.x, start.y)
            walk(randomChoice.cell)
            break
        case "left":
            moveLeft(start.x, start.y)
            walk(randomChoice.cell)
            break
    }
}


// general functions

function displayWalls() {
    console.log("displaying")
    for (let x = 0; x < maze.width; x++){
        for (let y = 0; y < maze.height; y++){
            let cell = maze.grid[x][y];
            if (cell.walls.right){
                cell.rightWall();
            } if (cell.walls.bottom){
                cell.bottomWall();
            } if (cell.walls.left){
                cell.leftWall();
            } if (cell.walls.top){
                cell.topWall();
            }
        }
    }
}

function start(){
    maze = new Maze(parseInt(sliderUnit.value), parseInt(sliderUnit.value), 500);
    canvas.width = maze.size;
    canvas.height = maze.size;
    maze.setup()
}

start()
console.log(walk(maze.grid[5][5]))
displayWalls()

