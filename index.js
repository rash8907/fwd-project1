//refresh page when pressing start over button
const refreshButton = document.querySelector('.refresh-button');

const refreshPage = () => {
  location.reload();
}

refreshButton.addEventListener('click', refreshPage)


const grid = document.querySelector('.box')

//width of each brick
const brickW = 100
//height of each brick
const brickH = 20

//ball size
const ballSize = 20

//grid box width px
const boxW = 560
//grid box height px
const boxH = 300


const scoreDisplay = document.querySelector('#score')
let score = 0

//player start postion
const playerStart = [230, 10]
//assigning starting position to current player position bc this will be changing
let playerPostion = playerStart


//creating block class to create 15 blocks in all differnt postions, passing through 2 parameter values
class Brick{
    constructor(xAxis, yAxis){
        this.upLeft = [xAxis, yAxis + brickH]
        this.upRight = [xAxis + brickW, yAxis + brickH]
        this.lowLeft = [xAxis, yAxis]
        this.lowRight = [xAxis + brickW, yAxis]
    }
}

//array of blocks
const bricks = [
    //row 1
    new Brick(10,270) , new Brick(120,270) , new Brick(230,270) , new Brick(340,270) , new Brick(450,270) , 
    //row 2
    new Brick(10,240) , new Brick(120,240) , new Brick(230,240) , new Brick(340,240) , new Brick(450,240) , 
   //row 3
    new Brick(10,210) , new Brick(120,210) , new Brick(230,210) , new Brick(340,210) , new Brick(450,210) , 
    //row 4
    new Brick(10,180) , new Brick(120,180) , new Brick(230,180) , new Brick(340,180) , new Brick(450,180) ,
    //row 5
    new Brick(10,150) , new Brick(120,150) , new Brick(230,150) , new Brick(340,150) , new Brick(450,150) , 

]

//draw blocks
function addBricks(){

    for (let i=0; i<bricks.length; i++){

     const brick = document.createElement('div')
     brick.classList.add('brick')
     //pulling xAxis
     brick.style.left = bricks[i].lowLeft[0] + 'px'
     //pulling yAxis
     brick.style.bottom = bricks[i].lowLeft[1] +'px'
     //current to new position
     grid.appendChild(brick)
    }
}

addBricks()

//creating player
const player = document.createElement('div')
player.classList.add('player')
drawPlayer()
grid.appendChild(player)

//draw player
//could include this in movePlayer, but this function is to avoid writing repetitive code
function drawPlayer(){
    player.style.left = playerPostion[0] + 'px'
    player.style.bottom = playerPostion[1] + 'px'   
}


const ballStart = [270, 40]
let ballNow = ballStart

//draw ball
function drawBall(){
    ball.style.left = ballNow[0] + 'px'
    ball.style.bottom = ballNow[1] + 'px'   

}

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

//move ball
function moveBall(){
    ballNow[0] += x
    ballNow[1] += y
    brickHits()
    drawBall()
}

//moving player around with keys
//pass through event
function movePlayer(e){
    //use switch case to detetc arrow keys
    switch(e.key){

        case 'ArrowRight':
            //want to move current player position
            if(playerPostion[0]<boxW-brickW){
                playerPostion[0] += 10
                //redraw player
                drawPlayer()
            }
            break;
        case 'ArrowLeft':
            if(playerPostion[0]>0){
                //stopping function once you get to edge of grid
                //if you press left you want to take away from the xAxis of current position
                playerPostion[0] -= 10
                
                drawPlayer()
                }
                break;

        //dont want keys to do anything
        case 'ArrowUp':
            break;
        case 'ArrowDown':
            break;
            
    }
}
let timer
timer = setInterval(moveBall, 20)


let x = -1.8
let y = 1.8

function changeDirection(){
    if (x === 1.8 && y === 1.8){
        y = -1.8
        return
    }
    if(x === 1.8 && y === -1.8){
        x = -1.8
        return
    }
    if (x === -1.8 && y ===-1.8){
        y = 1.8
        return
    }
    if(x === -1.8 && y ===1.8){
        x = 1.8
        return

    }
}

//check for collisions
function brickHits(){
    //check for brick collisions, loop for every brick
    for(let i = 0; i<bricks.length; i++){
        //if larger than lower left x/y axis, but smaller than lower right x/y axis, then its in area around brick
        if((ballNow[0]> bricks[i].lowLeft[0] && 
            ballNow[0]< bricks[i].lowRight[0]) && 
            ((ballNow[1] + ballSize) > bricks[i].lowLeft[1] && 
            ballNow[1] < bricks[i].upLeft[1] ))
            {
                const allBricks = Array.from(document.querySelectorAll('.brick'))
                //console.log(allBricks)
                //removing with the brick we are dealing with [i], cannot see it
                allBricks[i].classList.remove('brick')
                //removing one item from array
                //MDN Web Docs on array.protoype.splice()
                bricks.splice(i, 1)
                
                //increase score by one point with every collision
                score++
                scoreDisplay.innerHTML = score

                changeDirection()
        }

    }

    //check for player collisions, is ball in between player
    if((ballNow[0]> playerPostion[0] && ballNow[0]<playerPostion[0] + brickW) && (ballNow[1]>playerPostion[1] && ballNow[1]<playerPostion[1]+brickH)){
        changeDirection()
    }

    //chk for collision with walls
    if(ballNow[0]>=(boxW - ballSize) || ballNow[1]>= (boxH-ballSize) || ballNow[0]<=0){
        changeDirection()
    }

    //game over check
    if(ballNow[1]<=0){
        document.removeEventListener('keydown', movePlayer)
        clearInterval(timer)
        scoreDisplay.innerHTML = 'YOU LOSE'
     
    }
    //chek for win
    if(bricks.length === 0){
        document.removeEventListener('keydown', movePlayer)
        scoreDisplay.innerHTML = 'YOU WIN'
        clearInterval(timer)    
                }
}

//see if a key is pressed down to call moveplayer function
document.addEventListener('keydown', movePlayer)
 


//level2 code