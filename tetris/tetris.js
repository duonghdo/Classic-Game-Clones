/********************************************************
Project: tetris game
Author: Duong Do
Description: made with p5.js, finished 06/15
// TODO: fix drop to bottom
********************************************************/

var canvasWidth = 640;
var canvasHeight = 640;

var gameState; // 0 - Start, 1 - Playing, 2 - Pause , 3 - End
var tileSize = 30;
var boardx = 10, boardy = 20;
var board = [];
for(var i = 0; i < boardy; i++){
	board[i] = [];
}

var speed;
var score;

// variables contain current/next/stored tetromino
var current;
var next;
var stored;
var storedEmpty;

function setup(){
	var myCanvas = createCanvas(canvasWidth, canvasHeight);
	myCanvas.parent('mainCanvas');
	rectMode(CENTER);
	frameRate(60);
	gameState = 0;

}

function draw(){
	switch(gameState){
		case 0:{
			StartScreen();
		} break;
		case 1:{
			PlayScreen();
		} break;
		case 2:{
			PauseScreen();
		} break;
		case 3:{
			EndScreen();
		} break;
		default:{
			StartScreen();
		} break;
	}	
}

function StartScreen(){
	background(230);
	drawBorder();
	textAlign(CENTER);
	fill(100);
	textSize(40);
	stroke(100);
	text("Tetris", canvasWidth/2, canvasHeight/2-40);
	textSize(30);
	text("Press T to start game", canvasWidth/2, canvasHeight/2+10);

	speed = 15;
	score = 0;

	for (var i = 0; i < boardx; i ++){
		for (var j = 0; j < boardy; j ++){
			board[i][j] = 0;
		}
	}

	current = new tetromino();
	current.update();
	next = new tetromino();
	next.update();
	stored = new tetromino();
	storedEmpty = true;
}

function PlayScreen(){
	background(230);
	drawBorder();
	textSize(25);
	textAlign(LEFT);
	// text("Space - place piece", 380, 560);
	text("P - pause", 380, 590);
	text("Q - end current game", 380, 620);
	text("Next:", 380, 200);
	text("Stored:", 380, 350);
	textSize(35);
	text("Score: " + score, 380, 80);
	drawKey();
	drawStored();
	drawNext();

	for (var i = 0; i < boardx; i ++){
		for (var j = 0; j < boardy; j ++){
			if(board[i][j] == 0) noFill();
			else fill(100);
			stroke(0);
			rect(50+i*tileSize, 35+j*tileSize, tileSize, tileSize);
		}
	}

	if((frameCount % speed) == 0) {
		var prevY = current.y;
		move("down");
		if(prevY == current.y){
			updateBoard();
			nextPiece();
		}
	}

	current.update();
	current.display();
}

function PauseScreen(){
	background(255, 255, 255, 2);
	textAlign(CENTER);
	textSize(30);
	fill(150);
	stroke(150);
	text("Press p to resume", canvasWidth/2, canvasHeight/2);
}

function EndScreen(){
	background(230);
	textSize(35);
	textAlign(CENTER);
	fill(100);
	stroke(100);
	text("Score " + score, canvasWidth/2, canvasHeight/2-30);
	textSize(30);
	text("Press r to return to menu", canvasWidth/2, canvasHeight/2+20);
	drawBorder();
}

// tetromino class
function tetromino(){
	this.type = floor(random(7));		// 0 - L; 1 - J; 2 - T; 3 - Z; 4 - S; 5 - O; 6 - I
	this.x = 4;
	this.y = -1;
	this.loc = [];
	this.rotate = 0;

	this.update = function(){
		switch(this.type){
			case 0: {
				switch(this.rotate){
					case 0:{
						this.loc[0] = [this.x, this.y];			// X
						this.loc[1] = [this.x+1, this.y+1];		// O
						this.loc[2] = [this.x, this.y-1];		// X X
						this.loc[3] = [this.x, this.y+1];
					} break;
					case 1:{
						this.loc[0] = [this.x, this.y];			// X O X
						this.loc[1] = [this.x+1, this.y];		// X
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x-1, this.y+1];
						
					} break;
					case 2:{
						this.loc[0] = [this.x, this.y];			// X X
						this.loc[1] = [this.x, this.y+1];		//   O
						this.loc[2] = [this.x, this.y-1];		//   X
						this.loc[3] = [this.x-1, this.y-1];
					} break;
					case 3:{
						this.loc[0] = [this.x, this.y];			//	   X
						this.loc[1] = [this.x+1, this.y];		// X O X
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x+1, this.y-1];
					} break;
				}
				this.color = 'orange';
			} break;

			case 1: {
				switch(this.rotate){
					case 0:{
						this.loc[0] = [this.x, this.y];			// 	 X
						this.loc[1] = [this.x-1, this.y+1];		//	 O
						this.loc[2] = [this.x, this.y-1];		// x X
						this.loc[3] = [this.x, this.y+1];
					} break;
					case 1:{
						this.loc[0] = [this.x, this.y];			// X
						this.loc[1] = [this.x+1, this.y];		// X O X
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x-1, this.y-1];
					} break;
					case 2:{
						this.loc[0] = [this.x, this.y];			// X X
						this.loc[1] = [this.x, this.y+1];		// O
						this.loc[2] = [this.x, this.y-1];		// X
						this.loc[3] = [this.x+1, this.y-1];
					} break;
					case 3:{
						this.loc[0] = [this.x, this.y];			// X O X
						this.loc[1] = [this.x+1, this.y];		//	   X
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x+1, this.y+1];
					} break;
				}				
				this.color = 'blue';
			} break;

			case 2: {
				switch(this.rotate){
					case 0:{
						this.loc[0] = [this.x, this.y];			// X O X
						this.loc[1] = [this.x-1, this.y];		//   X
						this.loc[2] = [this.x+1, this.y];
						this.loc[3] = [this.x, this.y+1];
					} break;
					case 1:{
						this.loc[0] = [this.x, this.y];			//   X
						this.loc[1] = [this.x, this.y+1];		// X O
						this.loc[2] = [this.x, this.y-1];		//   X
						this.loc[3] = [this.x-1, this.y];
					} break;
					case 2:{
						this.loc[0] = [this.x, this.y];			// 	 X
						this.loc[1] = [this.x+1, this.y];		// X O X
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x, this.y-1];
					} break;
					case 3:{
						this.loc[0] = [this.x, this.y];			// X 
						this.loc[1] = [this.x, this.y-1];		// O X
						this.loc[2] = [this.x, this.y+1];		// X
						this.loc[3] = [this.x+1, this.y];
						
					} break;
					
				}
				this.color = 'purple';
			} break;

			case 3: {
				switch(this.rotate){
					case 0:
					case 2:{						
						this.loc[0] = [this.x, this.y];			// X O
						this.loc[1] = [this.x-1, this.y];		// 	 x X
						this.loc[2] = [this.x, this.y+1];
						this.loc[3] = [this.x+1, this.y+1];
					} break;
					case 1:
					case 3:{
						this.loc[0] = [this.x, this.y];			//   X
						this.loc[1] = [this.x-1, this.y];		// X O
						this.loc[2] = [this.x, this.y-1];		// X
						this.loc[3] = [this.x-1, this.y+1];
					} break;
				}
				this.color = 'red';
			} break;

			case 4: {
				switch(this.rotate){
					case 0:
					case 2:{						
						this.loc[0] = [this.x, this.y];			//	 O X
						this.loc[1] = [this.x+1, this.y];		// X X
						this.loc[2] = [this.x, this.y+1];
						this.loc[3] = [this.x-1, this.y+1];
					} break;
					case 1:
					case 3:{
						this.loc[0] = [this.x, this.y];			// X
						this.loc[1] = [this.x+1, this.y];		// O X
						this.loc[2] = [this.x, this.y-1];		//   X
						this.loc[3] = [this.x+1, this.y+1];
					} break;
				}				
				this.color = 'green';
			} break;

			case 5: {
				this.loc[0] = [this.x, this.y];			// O X
				this.loc[1] = [this.x+1, this.y];		// X X
				this.loc[2] = [this.x, this.y+1];
				this.loc[3] = [this.x+1, this.y+1];
				this.color = 'yellow';
			} break;

			case 6: {
				switch(this.rotate){
					case 0:{
						this.loc[0] = [this.x, this.y];			// X
						this.loc[1] = [this.x, this.y+1];		// X
						this.loc[2] = [this.x, this.y-2];		// O
						this.loc[3] = [this.x, this.y-1];		// X
					} break;
					case 1:{
						this.loc[0] = [this.x, this.y];			// X O X X
						this.loc[1] = [this.x+1, this.y];
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x+2, this.y];
					} break;
					case 2:{
						this.loc[0] = [this.x, this.y];			// X
						this.loc[1] = [this.x, this.y-1];		// O
						this.loc[2] = [this.x, this.y+2];		// X
						this.loc[3] = [this.x, this.y+1];		// X
					} break;
					case 3:{
						this.loc[0] = [this.x, this.y];			// X X O X
						this.loc[1] = [this.x+1, this.y];
						this.loc[2] = [this.x-1, this.y];
						this.loc[3] = [this.x-2, this.y];						
					} break;					
				}
				
				this.color = 'cyan';
			} break;

			default: {} break;
		}
	}

	this.display = function(){
		for (var i = 0; i < this.loc.length; i++){
			if(this.loc[i][1] >= 0){
				fill(this.color);
				stroke(0);
				rect(50+this.loc[i][0]*tileSize, 35+this.loc[i][1]*tileSize, tileSize, tileSize);
			}
		}
	}
}


// handle movement, check collision
function move(dir){
	var moveValid = true;
	var moveCheck = new tetromino();
	moveCheck.x = current.x;
	moveCheck.y = current.y;
	moveCheck.type = current.type;
	moveCheck.rotate = current.rotate;
	switch(dir){
		case "left":{
			moveCheck.x--;
			moveCheck.update();
			for(var i = 0; i <moveCheck.loc.length; i++){
				if(moveCheck.loc[i][0] < 0) {
					moveValid = false;
					break;
				}
				if(board[moveCheck.loc[i][0]][moveCheck.loc[i][1]] == 1) {
					moveValid = false;
					break;
				}
			}
		} break;

		case "right":{
			moveCheck.x++;
			moveCheck.update();
			for(var i = 0; i <moveCheck.loc.length; i++){
				if(moveCheck.loc[i][0] >= boardx) {
					moveValid = false;
					break;
				}
				if(board[moveCheck.loc[i][0]][moveCheck.loc[i][1]] == 1) {
					moveValid = false;
					break;
				}
			}
		} break;

		case "up":{
			moveCheck.rotate = (moveCheck.rotate + 1) % 4;
			moveCheck.update();
			for(var i = 0; i <moveCheck.loc.length; i++){
				if(moveCheck.loc[i][0] < 0) {
					moveValid = false;
					break;
				}
				if(moveCheck.loc[i][0] >= boardx) {
					moveValid = false;
					break;
				}
				if(moveCheck.loc[i][1] >= boardy) {
					moveValid = false;
					break;
				}
				if(board[moveCheck.loc[i][0]][moveCheck.loc[i][1]] == 1) {
					moveValid = false;
					break;
				}
			}
		} break;

		case "down":{
			moveCheck.y++;
			moveCheck.update();
			for(var i = 0; i <moveCheck.loc.length; i++){
				if(moveCheck.loc[i][1] >= boardy) {
					moveValid = false;
					break;
				}
				if(board[moveCheck.loc[i][0]][moveCheck.loc[i][1]] == 1) {
					moveValid = false;
					break;
				}
			}
		} break;

		// case "bottom":{
		// 	var canGoDown = true;
		// 	while(canGoDown){
		// 		moveCheck.y++;
		// 		moveCheck.update();
		// 		for(var i = 0; i <moveCheck.loc.length; i++){
		// 			if(moveCheck.loc[i][1] >= boardy) {
		// 				canGoDown = false;
		// 				break;
		// 			}
		// 			if(board[moveCheck.loc[i][0]][moveCheck.loc[i][1]] == 1) {
		// 				canGoDown = false;
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	moveCheck.y--;
		// }
	}
	if(moveValid) {
		current.x = moveCheck.x;
		current.y = moveCheck.y;
		current.rotate = moveCheck.rotate;
	}
}


// update board where pieces have landed, check for full lines
function updateBoard(){
	for(var i = 0; i < current.loc.length; i++){
		if(current.loc[i][1] < 0) gameState = 3;
		board[current.loc[i][0]][current.loc[i][1]] = 1;
	}
	var combo = 0;
	for(var j = current.y-2; j < current.y+3; j++){
		var tmpCount = 0
	
		for(var i = 0; i < boardx; i++){
			if (board[i][j] == 1) tmpCount++;
		}
		
		if(tmpCount == boardx){
			clearLine(j);
			combo++;
		}
	}
	score += combo*combo*10;
}

// clear full lines
function clearLine(line){
	for(var i = 0; i < boardx; i++){
		board[i][line] = 0;
	}
	for(var j = line; j > 0; j--){
		for(var i = 0; i < boardx; i++){
			board[i][j] = board[i][j-1];
		}
	}
}


// get next piece
function nextPiece(){
	current.x = next.x;
	current.y = next.y;
	current.type = next.type;
	current.rotate = next.rotate;
	next = new tetromino();
	next.update();
}

function drawNext(){
	for (var i = 0; i < next.loc.length; i++){
		fill(next.color);
		stroke(0);
		rect(400+next.loc[i][0]*tileSize, 230+next.loc[i][1]*tileSize, tileSize, tileSize);
	}
}

// get stored piece
function storedPiece(){
	var tmp  = current.type;
	current.type = stored.type;
	current.rotate = stored.rotate;
	stored.type = tmp;
	stored.update();
}

function firstStored(){
	stored.type = current.type;
	stored.update();
	nextPiece();
	storedEmpty = false;
}

function drawStored(){
	for (var i = 0; i < stored.loc.length; i++){
		fill(stored.color);
		stroke(0);
		rect(400+stored.loc[i][0]*tileSize, 380+stored.loc[i][1]*tileSize, tileSize, tileSize);
	}
}


// draw canvas border
function drawBorder(){
	var bsize = 5;
	noStroke();
	fill(100);
	rect(canvasWidth/2, canvasHeight - bsize/2, canvasWidth, bsize);
	rect(canvasWidth/2, bsize/2, canvasWidth, bsize);
	rect(bsize/2, canvasHeight/2, bsize, canvasHeight);
	rect(canvasWidth - bsize/2, canvasHeight/2, bsize, canvasHeight);
}

// handle key input
function keyPressed(){
	switch(keyCode){
		case UP_ARROW:{
			move("up");
		} break;
		case DOWN_ARROW:{
			if(!((frameCount % speed) == 0)){
				move("down");
			}
		} break;
		case LEFT_ARROW:{
			move("left");
		} break;
		case RIGHT_ARROW:{
			move("right");
		} break;
		// case 32:{			// space
		// 	if(!((frameCount % speed) == 0) && current.y > 0){
		// 		move("bottom");
		// 	}
		} break;

		case 80:{		// p
			if (gameState == 1) gameState = 2;
			else if (gameState == 2) gameState = 1;
			else {}
		} break;
		case 81:{ 		// q
			if(gameState == 1) gameState = 3;
		} break;
		case 82:{		// r
			if(gameState == 3) gameState = 0;
		} break;
		case 83:{
			if(storedEmpty) firstStored();
			else {
				storedPiece();
			}
		} break;
		case 84:{		// t
			if(gameState == 0) {
				gameState = 1;
			}
		} break;
		default:{} break;
	}
}

function drawKey(){
	var rSize = 50;
	var x = [160, 110, 160, 210];
	var y = [450, 500, 500, 500];
	var z = [canvasWidth-x[0], canvasWidth-x[1], canvasWidth-x[2], canvasWidth-x[3]];
	noFill();
	stroke(100);
	for(var i = 0; i < 4; i++){
		rect(z[i], y[i], rSize, rSize);
	}
	fill(100);
	noStroke();
	triangle(z[0], y[0]-10, z[0]-10, y[0]+10, z[0]+10, y[0]+10);
	triangle(z[1]+10, y[1], z[1]-10, y[1]+10, z[1]-10, y[1]-10);
	triangle(z[2], y[2]+10, z[2]-10, y[2]-10, z[2]+10, y[2]-10);
	triangle(z[3]-10, y[3], z[3]+10, y[3]+10, z[3]+10, y[3]-10);
}