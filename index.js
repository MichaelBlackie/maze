const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const sliderUnit = document.getElementById("sizeSlider");
const timeSlider = document.getElementById("timeSlider");

let goal;

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

        if (this.width % 2 === 0){
            this.grid[this.width - 2][this.height - 2].fill("red")
            goal = {x: this.width - 2, y: this.width - 2}
        } else {
            this.grid[this.width - 1][this.height - 1].fill("red")
            goal = {x: this.width - 1, y: this.width - 1}
        }
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
        this.pathed = false;
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
    let t0 = performance.now();
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
    let t1 = performance.now();
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
    maze.grid[x][y - 1].visited = true;
}

function moveRight(x,y){
    maze.grid[x + 1][y].visited = true;
}

function moveDown(x,y){
    maze.grid[x][y + 1].visited = true;
}

function moveLeft(x,y){
    maze.grid[x - 1][y].visited = true;
}

function walk(start){
    start.visited = true
    let affectedCell = null;
    let options = []

    let topNotVisited = false
    let bottomNotVisited = false
    let rightNotVisited = false
    let leftNotVisited = false

    if (start.y > 1) {topNotVisited = (maze.grid[start.x][start.y - 2].visited != true)}
    else {topNotVisited = false}

    if (start.y < maze.height -2) {bottomNotVisited = (maze.grid[start.x][start.y + 2].visited != true)}
    else {bottomNotVisited = false}

    if (start.x < maze.width -2) {rightNotVisited = (maze.grid[start.x + 2][start.y].visited != true)}
    else {rightNotVisited = false}

    if (start.x > 1){leftNotVisited = (maze.grid[start.x - 2][start.y].visited != true)}
    else {leftNotVisited = false}

    
    if (topNotVisited){
        options.push({cell: maze.grid[start.x][start.y - 2], direction: "up"})
    } if (bottomNotVisited){
        options.push({cell: maze.grid[start.x][start.y + 2], direction: "down"})
    } if (rightNotVisited){
        options.push({cell: maze.grid[start.x + 2][start.y], direction: "right"})
    } if (leftNotVisited){
        options.push({cell: maze.grid[start.x - 2][start.y], direction: "left"})
    } else if (!leftNotVisited && !rightNotVisited && !bottomNotVisited && !topNotVisited){
        hunt()
        return
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

    options = []
}

function hunt(){
    for (let x = 0; x < maze.width; x += 2){
        for (let y = 0; y < maze.height; y += 2){
            if (maze.grid[x][y].visited === false){
                visited = checkAdjacent(maze.grid[x][y])

                let randomDirection = visited[Math.floor(Math.random() * visited.length)]

                switch (randomDirection){
                    case "top":
                        moveUp(maze.grid[x][y].x, maze.grid[x][y].y)
                        walk(maze.grid[x][y])
                        break
                    case "bottom":
                        moveDown(maze.grid[x][y].x, maze.grid[x][y].y)
                        walk(maze.grid[x][y])
                        break
                    case "right":
                        moveRight(maze.grid[x][y].x, maze.grid[x][y].y)
                        walk(maze.grid[x][y])
                        break
                    case "left":
                        moveLeft(maze.grid[x][y].x, maze.grid[x][y].y)
                        walk(maze.grid[x][y])
                        break
                }
            }   
        }
    }
}

function checkAdjacent(start){
    visited = []

    if (start.y > 1 ){
        if (maze.grid[start.x][start.y - 2].visited){
            visited.push("top")
        }
    }

    if (start.y < maze.height -2) {
        if(maze.grid[start.x][start.y + 2].visited){
            visited.push("bottom")
        }
    }

    if (start.x < maze.width -2) {
        if(maze.grid[start.x + 2][start.y].visited){
            visited.push("right")
        }
    }

    if (start.x > 1) {
        if(maze.grid[start.x - 2][start.y].visited){
            visited.push("left")
        }
    }

    return visited
}

function generateHuntAndKillMaze(){
    let huntT0 = performance.now();
    maze = new Maze(parseInt(sliderUnit.value), parseInt(sliderUnit.value), 500);
    canvas.width = maze.size;
    canvas.height = maze.size;
    maze.setup()
    walk(maze.grid[0][0])
    let huntT1 = performance.now();
    console.log(`Generated ${maze.width} by ${maze.height} maze using hunt and kill algorithm`)
    console.log(`Generation took ${huntT1 - huntT0} milliseconds.`);
    displayWalls()
}


// Depth first search path finding

function depthFirstSearch(){
    let delay = 200;
    console.log(delay)
    let pathT0 = performance.now();
    let curNode;
    let stack = [maze.grid[0][0]]
    let path = []

    while (true){
        curNode = stack[stack.length - 1];
        path.push(curNode)
        curNode.pathed = true

        if (curNode.x === goal.x && curNode.y === goal.y){
            console.log("found path")
            stack.forEach((cell) => {
                setTimeout(() => {cell.fill("rgba(255, 182, 65, 1)")}, delay)
            })
            break;
        }

        var unpathed = 0;
        var adjacent = returnAdjacent(curNode)

        adjacent.forEach((cell) => {
            if (!cell.pathed) {
                stack.push(cell);
                setTimeout(() => {cell.fill("rgba(255, 182, 65, 0.41)")}, delay)
                unpathed += 1;
            }
        });

        if (unpathed === 0){
            stack.pop()
        }

    }

    let pathT1 = performance.now();
    console.log(`Found path using the Depth First Search algorithm`)
    console.log(`Pathfinding took ${pathT1 - pathT0} milliseconds.`);
}

function returnAdjacent(start){
    let found = []
    if (start.y > 0 ){
        if (maze.grid[start.x][start.y - 1].visited){
            found.push(maze.grid[start.x][start.y - 1])
        }
    }

    if (start.y < maze.height -1) {
        if(maze.grid[start.x][start.y + 1].visited){
            found.push(maze.grid[start.x][start.y + 1])
        }
    }

    if (start.x < maze.width -1 ) {
        if(maze.grid[start.x + 1][start.y].visited){
            found.push(maze.grid[start.x + 1][start.y])
        }
    }

    if (start.x > 0) {
        if(maze.grid[start.x - 1][start.y].visited){
            found.push(maze.grid[start.x - 1][start.y])
        }
    }

    return found
}


// general functions

function displayWalls() {
    let walls = 0
    console.log("displaying...")
    for (let x = 0; x < maze.width; x++){
        for (let y = 0; y < maze.height; y++){
            let cell = maze.grid[x][y];
            if (!cell.visited){
                cell.fill("black")
            }
        }
    }
    console.log(walls)
}

