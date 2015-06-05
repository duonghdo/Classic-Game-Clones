/********************************************************
Project: breakout game
Author: Duong Do
Description: made with p5.js, finished 05/15
// TODO: add power ups, redesign/add levels, refine physics
********************************************************/

var canvasWidth = 640;
var canvasHeight = 480;

var gameState; // 0 - Start, 1 - Playing, 2 - Pause , 3 - End
var Paddle = new paddle();
var Ball = [];
var Brick = [];
var narrowA;
var wideA;
var hitTimer = 0;
var level;
var life;
var win = false;
var brickColor = {x: 0, y: 0, z: 0};


function setup(){
	var myCanvas = createCanvas(canvasWidth, canvasHeight);
	myCanvas.parent('mainCanvas');
	rectMode(CENTER);
	ellipseMode(CENTER);
	frameRate(60);
	stroke(0);
	gameState = 0;
	narrowA = atan(20/70);
	wideA = atan(70/20);
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
	level = 1;
	createLevel(level);
	life = 3;
	background(230);
	drawBorder();
	textAlign(CENTER);
	fill(100);
	textSize(40);
	stroke(100);
	text("Breakout", canvasWidth/2, canvasHeight/2-40);
	textSize(30);
	text("Press S to start game", canvasWidth/2, canvasHeight/2+10);
}

function PlayScreen(){
	if(!Brick[0]){
		level++;
		if(level == 6) {
			win = true;
			gameState = 3;
		}
		createLevel(level);
	}

	background(230);
	drawBorder();
	textSize(20);
	textAlign(LEFT);
	text("P - pause", 20, 30);
	text("Q - end current game", 150, 30);
	text("C - change brick color", 370, 30);
	text("Level: " + level, 20, 50);
	text("Life: " + life, 150, 50);
	for(var i = 0; i < life; i++){
		ellipse(220+i*13, 42, 10, 10);
	}

	Paddle.move();
	Paddle.display();
	if (!Ball[0]) Ball.push(new ball(true));
	if(Ball[0].onPaddle) {
		fill(100);
		textAlign(CENTER);
		text("Use mouse to move paddle", canvasWidth/2, Paddle.locy - 60);
		text("Press Space to launch ball", canvasWidth/2, Paddle.locy - 40);
	}
	Ball[0].update();
	Ball[0].display();
	for (var i = 0; i < Brick.length; i++){
		Brick[i].display();
	}
	hitTimer--;

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
	if(win) var result = "won!";
	else var result = "lost!";
	text("You " + result, canvasWidth/2, canvasHeight/2-30);
	textSize(30);
	text("Press r to return to menu", canvasWidth/2, canvasHeight/2+20);
	drawBorder();
}


// paddle class
function paddle(){
	this.locx = canvasWidth/2;
	this.locy = canvasHeight - 10;
	this.w = 100;
	this.h = 10;

	this.move = function(){
		this.locx = mouseX;
		if (this.locx < 0) this.locx = 0;
		if (this.locx > canvasWidth) this.locx = canvasWidth;
	};

	this.display = function(){
		fill('red');
		noStroke();
		ellipse(this.locx, this.locy, this.w, this.h);
	};
}


// ball class
function ball(onPaddle){
	this.locx = 0;
	this.locy = 0;
	this.bsize = 10;
	this.onPaddle = onPaddle;		// start on paddle

	this.velx = 0;					// velocity
	this.vely = 0;

	this.update = function(){
		if(this.onPaddle){
			this.locx = Paddle.locx;
			this.locy = Paddle.locy - 10;	
		} 
		else {
			this.calVel();
			this.calLoc();
		}
	}

	this.calVel = function(){
		// check if meet left and right border
		if(this.locx < this.bsize/2){
			this.locx = this.bsize/2;
			this.velx = -this.velx;
		}
		if(this.locx > canvasWidth-this.bsize/2){
			this.locx = canvasWidth-this.bsize/2;
			this.velx = -this.velx;
		}


		// check if meet ceiling
		if(this.locy < this.bsize/2){
			this.locy = this.bsize/2;
			this.vely = -this.vely;
		}

		// check if meet paddle
		if(this.locy > Paddle.locy-10){
			if (this.locy <= Paddle.locy){
				if(this.locx > Paddle.locx-Paddle.w/2 && this.locx < Paddle.locx+Paddle.w/2){
					this.vely = -this.vely;
					this.velx = (Paddle.locx - this.locx) * (-1/5);
				}
			}
			else if(this.locy > Paddle.locy) {
				Ball.pop();
				life--;
				if(life < 0) gameState = 3;
			}
		}

		// check if meet brick
		for(var i = 0; i < Brick.length; i++){
			if(this.locx+this.bsize/2 > Brick[i].locx-Brick[i].w/2 
				&& this.locx-this.bsize/2 < Brick[i].locx+Brick[i].w/2
				&& this.locy+this.bsize/2 > Brick[i].locy-Brick[i].h/2 
				&& this.locy-this.bsize/2 < Brick[i].locy+Brick[i].h/2
				&& hitTimer <= 0){

				// variable to calculate collision angle
				var a = Brick[i].locx - this.locx;
				var b = Brick[i].locy - this.locy;
				var v = new p5.Vector(a, b);
				v.normalize();

				// check left or right
				if( (v.heading() < narrowA && v.heading() > -narrowA && this.velx > 0)
						|| (((v.heading() < -PI+narrowA) || (v.heading() > PI-narrowA)) && this.velx < 0) ) {
					this.velx = -this.velx;
				} else
					this.vely = - this.vely;

				Brick.splice(i, 1);
				hitTimer = 2;
				break;
			}
		}
	}

	this.calLoc = function(){
		this.locx += this.velx;
		this.locy += this.vely;
	}

	this.startMove = function(){
		this.onPaddle = false;
		this.velx = 0;
		this.vely = -5;
	}

	this.display = function(){
		fill('green');
		noStroke();
		ellipse(this.locx, this.locy, this.bsize, this.bsize);
	}
}


// brick class
function brick(locx, locy){
	this.locx = locx;
	this.locy = locy;
	this.w = 70;
	this.h = 20;

	this.display = function(){
		fill(brickColor.x, brickColor.y, brickColor.z);
		rect(this.locx, this.locy, this.w, this.h);
	}
}

// create Level
function createLevel(level){
	Ball.length = 0;
	Brick.length = 0;
	changeColor();
	switch(level){
		case 1:{
			for(var i = 0; i < 8; i++){
				for(var j = 0; j < 8; j++){
					Brick.push(new brick(71+i*71, 101+j*21));
				}
			}
		} break;
		case 2:{
			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 14; j++){
					Brick.push(new brick(110+i*70*2, 64+j*21));
				}
			}
		} break;
		case 3:{
			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 14; j++){
					Brick.push(new brick( 71 + (j%2)*71 + i*71*2, 64+j*21 ) );
				}
			}
		} break;
		case 4:{
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 6; j++){
					Brick.push(new brick(80+i*71, 131+j*21));
				}
			}
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 6; j++){
					Brick.push(new brick(canvasWidth-80-i*71, 131+j*21));
				}
			}
			for(var j = 0; j < 14; j++){
				Brick.push(new brick(canvasWidth/2, 61+j*21));
			}
		} break;
		case 5:{
			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 6; j++){
					Brick.push(new brick(canvasWidth/2-71+i*71, 131+j*21));
				}
			}
			for(var j = 0; j < 4; j++){
				Brick.push(new brick(canvasWidth/2-2*71, 152+j*21));
				Brick.push(new brick(canvasWidth/2+2*71, 152+j*21));				
			}
			for(var j = 0; j < 2; j++){
				Brick.push(new brick(canvasWidth/2-3*71, 173+j*21));
				Brick.push(new brick(canvasWidth/2+3*71, 173+j*21));				
			}
			for(var i = 0; i < 9; i++){
				for(var j = 0; j < 2; j++){
					Brick.push(new brick(36+i*71, 315+j*21));
				}
			}
		}
		default: break;
	}
}

// draw canvas border
function drawBorder(){
	var psize = 10;
	noStroke();
	fill(100);
	rect(canvasWidth/2, canvasHeight - psize/4, canvasWidth, psize/2);
	rect(canvasWidth/2, psize/4, canvasWidth, psize/2);
	rect(psize/4, canvasHeight/2, psize/2, canvasHeight);
	rect(canvasWidth - psize/4, canvasHeight/2, psize/2, canvasHeight);
}

// change brick color
function changeColor(){
	brickColor.x = random(0,255);
	brickColor.y = random(0,255);
	brickColor.z = random(0,255);
}

// handle key input
function keyPressed(){
	switch(keyCode){
		case 32:{			// space
			if(Ball[0].onPaddle) Ball[0].startMove();
		} break;
		case 67:{		// c
			changeColor();
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
		case 83:{		// s
			if(gameState == 0) {
				gameState = 1;
			}
		} break;
		default:{} break;
	}
}