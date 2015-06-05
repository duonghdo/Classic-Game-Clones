/********************************************************
Project: snake game
Author: Duong Do
Description: made with p5.js, finished 05/15
********************************************************/

var canvasWidth = 640;
var canvasHeight = 480;
var psize = 20; // part/food size

var score;
var gameState; // 0 - start, 1 - play, 2 - pause, 3 - end
var gameMode; // 0 - border, 1 - borderless
var snake = [];
var food = {x:0, y:0};
var currentD;
var nextD;

function setup(){
	var myCanvas = createCanvas(canvasWidth, canvasHeight);
	myCanvas.parent('mainCanvas');
	rectMode(CENTER);
	textAlign(CENTER);
	frameRate(30);
	stroke(200,180,100);

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
	background(20,20,20);	
	textSize(35);
	fill(200, 180, 100);
	text("Snake", canvasWidth/2, canvasHeight/2-100);
	textSize(20);
	textAlign(LEFT);
	text("B: border mode", canvasWidth/2-100, canvasHeight/2-50);
	text("N: borderless mode", canvasWidth/2-100, canvasHeight/2-20);
	drawBorder();
	drawKey();
	
	score = 0;
	snake.length = 0;
	snake[0] = {x: canvasWidth/2, y: canvasHeight/2};
	currentD = "right";
	nextD = "right";
	createFood(food);
}

function PlayScreen(){
	background(20,20,20);
	textSize(20);
	textAlign(LEFT);
	fill(255);
	text("P - pause		|| 		Q - end current game 	||		Score: " + score, 20, 30);
	if(gameMode == 0) text("Border mode", 20, canvasHeight-30);
	else if(gameMode == 1) text("Borderless mode", 20, canvasHeight-30);

	currentD = nextD;

	render(snake[0].x, snake[0].y, 'grey');
	for(var i = 1; i < snake.length; i++){
		var part = snake[i];
		render(part.x, part.y, 'white');
	}
	drawBorder();
	update();
	render(food.x, food.y, 'red');
}

function PauseScreen(){
	background(255, 255, 255, 1);
	textSize(30);
	fill(200, 180, 100);
	text("Press p to resume", canvasWidth/2, canvasHeight/2);
}

function EndScreen(){
	background(20,20,20);
	textSize(30);
	fill(200, 180, 100);
	text("Score: " + score, canvasWidth/2, canvasHeight/2-20);
	textSize(20);
	text("Press r to return to menu", canvasWidth/2, canvasHeight/2+20);
	drawBorder();
}

// render body part | food
function render(x, y, r){
	fill(r);
	noStroke();
	rect(x, y, psize, psize);
}

function drawBorder(){
	if (gameState == 0 || gameState == 3) fill(200,180,100);
	else if (gameMode == 0) fill('green');
	else if(gameMode == 1) fill(200);
	noStroke();
	rect(canvasWidth/2, psize/4, canvasWidth, psize/2);
	rect(canvasWidth/2, canvasHeight - psize/4, canvasWidth, psize/2);
	rect(psize/4, canvasHeight/2, psize/2, canvasHeight);
	rect(canvasWidth - psize/4, canvasHeight/2, psize/2, canvasHeight);
}

// update snake location
function update(){
	// check if snake meet body
	for(var i = 3; i < snake.length; i++){
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
			gameState = 3;
		}
	}
	// check if snake meet border
	if(gameMode == 0){
		if(snake[0].x < psize/2 || snake[0].x > (canvasWidth - psize/2) 
			|| snake[0].y < psize/2 || snake[0].y > (canvasHeight - psize/2)){
			gameState = 3;
		}
	}
	else if(gameMode == 1){
		// check border, borderless mode
		if(snake[0].x < psize/2) snake[0].x = canvasWidth - psize;
		else if(snake[0].x > canvasWidth - psize/2) snake[0].x = psize;
		else if(snake[0].y < psize/2) snake[0].y = canvasHeight - psize;
		else if(snake[0].y > canvasHeight - psize/2) snake[0].y = psize;
		else {}
	}

	// check if snake meet food
	if(snake[0].x == food.x && snake[0].y == food.y){
		score++;
		snake.unshift({x: food.x, y: food.y});

		createFood(food);
	}
	var newHead = {x: snake[0].x, y:snake[0].y};

	// move
	checkDirection(newHead, nextD);
	snake.pop();
	snake.unshift({x: newHead.x, y: newHead.y});

}

// create food
function createFood(food){
	var valid = false;
	var x;
	var y;
	while(!valid){
		var counter = 0;
		x = floor(random(1, canvasWidth/psize)) * psize;
		y = floor(random(1, canvasHeight/psize)) * psize;
		for (var i = 0; i <snake.length; i++){
			if(x == snake[i].x && y == snake[i].y){
				counter = 1;
				break;
			}
		}
		if(counter == 0) valid = true;
	}
	food.x = x;
	food.y = y;
}

// check valid direction
function checkDirection(newHead, direction){
	switch(direction){
		case "up": {
			newHead.y -= psize;
		} break;
		case "down": {
			newHead.y += psize;
		} break;
		case "left": {
			newHead.x -= psize;
		} break;
		case "right": {
			newHead.x += psize;
		} break;
	}
}

// handle input
function keyPressed(){
	switch(keyCode){
		case 87: 		// w
		case UP_ARROW:{
			if(currentD != "down") {
				nextD = "up";
			}
		} break;
		case 83: 		// s
		case DOWN_ARROW:{
			if(currentD != "up"){
				nextD = "down";
			}
		} break;
		case 65: 		// a
		case LEFT_ARROW:{
			if(currentD != "right"){
				nextD = "left";
			}
		} break;
		case 68: 		// d
		case RIGHT_ARROW:{
			if(currentD != "left") {
				nextD = "right";
			}
		} break;

		case 81:{ 		// q
			if(gameState == 1) gameState = 3;
		} break;
		case 80:{		// p
			if (gameState == 1) gameState = 2;
			else if (gameState == 2) gameState = 1;
			else {}
		} break;
		case 82:{		// r
			if(gameState == 3) gameState = 0;
		} break;
		case 66:{		// b
			if(gameState == 0) {
				gameMode = 0;
				gameState = 1;
			}
		} break;
		case 78:{		// n
			if(gameState == 0) {
				gameMode = 1;
				gameState = 1;
			}
		} break;
		default: break;
	}
}

// draw key input
function drawKey(){
	rSize = 50;
	var x = [200, 150, 200, 250];
	var y = [300, 350, 350, 350];
	var z = [canvasWidth-x[0], canvasWidth-x[1], canvasWidth-x[2], canvasWidth-x[3]];
	noFill();
	stroke(200,180,100);
	for(var i = 0; i < 4; i++){
		rect(x[i], y[i], rSize, rSize);
		rect(z[i], y[i], rSize, rSize);
	}
	fill(200, 180, 100);
	textSize(20);
	textAlign(CENTER);
	text("W", x[0], y[0]);
	text("A", x[1], y[1]);
	text("S", x[2], y[2]);
	text("D", x[3], y[3]);
	noStroke();
	triangle(z[0], y[0]-10, z[0]-10, y[0]+10, z[0]+10, y[0]+10);
	triangle(z[1]+10, y[1], z[1]-10, y[1]+10, z[1]-10, y[1]-10);
	triangle(z[2], y[2]+10, z[2]-10, y[2]-10, z[2]+10, y[2]-10);
	triangle(z[3]-10, y[3], z[3]+10, y[3]+10, z[3]+10, y[3]-10);

}