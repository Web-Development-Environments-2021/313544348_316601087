// var canvas = document.getElementById('canvas');v
var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var ghostInterval;
var listOfUsers = [['k','k']];
var leftArrow = 37;
var rightArrow = 39;
var upArrow = 38;
var downArrow = 40;
var boardLength = 10;
var ghostPositions = [[0,0], [0,boardLength-1], [boardLength-1,0], [boardLength-1,boardLength-1]];
;
var ghosts_amount=4;
var notValidMove = [4, 6, 7 , 8, 9, 50, 100];
var keyboardDiraction = 4;
// var boardLength = 15;
var lifes;
var focreStrawberry;
var heart;
var listOfGhost = new Array();
var audio = new Audio('Keep-Yourself-Alive.mp3');




$(document).ready(function() {
	show("welcome");
	//number of balls value slider
	var slider = document.getElementById("balls");
	var output = document.getElementById("numberballs");
	output.innerHTML = slider.value;
	//number of monsters value slider
	var slider2 = document.getElementById("monsters");
	var output2 = document.getElementById("numbermonsters");
	output2.innerHTML = slider2.value;

	// open and close modal
	//get modal
	var modal = document.getElementById("about");
	//get openModal from menu
	var btn = document.getElementById("openModal");
	//get close buttom X
	var span = document.getElementsByClassName("close")[0];
	// When the user clicks the openModal-> open the modal 
	btn.onclick = function() {
	modal.style.display = "block";
	}
	// When the user clicks on <span> (x)-> close the modal
	span.onclick = function() {
	modal.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal-> close the modal
	window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
	}
	// When the user clicks on Esc key-> close the modal
	var modal = document.querySelector('.modal')
	window.addEventListener('keydown', function (event) {
	if (event.key === 'Escape') {
		modal.style.display = 'none'
	}
	})
});



function initialGhosts(board){
	for (var i = 0; i < ghosts_amount; i++) {
		listOfGhost[i] = new Object();
		listOfGhost[i].direction = "right";
		listOfGhost[i].id = i+6; //6,7,8,9
		listOfGhost[i].col = ghostPositions[i][0];
		listOfGhost[i].row = ghostPositions[i][1];
		listOfGhost[i].img = new Image();
		listOfGhost[i].img.src = "images/ghosts/" + (i + 1) + ".png";
		listOfGhost[i].prev = 0;
		board[listOfGhost[i].col][listOfGhost[i].row] = listOfGhost[i].id;

	}	
}

function initialStrawberry(board){
	focreStrawberry = new Object()
	focreStrawberry.img = new Image();
	focreStrawberry.img.src = "images/force.png";
	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 50;
	focreStrawberry.col = emptyCell[0];
	focreStrawberry.row = emptyCell[1];
	focreStrawberry.id = 50;
	focreStrawberry.prev = 0;
}

function initialHeart(board){
	heart = new Object()
	heart.img = new Image();
	heart.img.src = "images/heart.png";
	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 100;
	heart.col = emptyCell[0];
	heart.row = emptyCell[1];
	heart.id = 100;
	heart.prev = 0;
}


function initialCandy(board){
	candy = new Object()
	candy.img = new Image();
	candy.img.src = "images/candy.jpg";
	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 200;
	candy.col = emptyCell[0];
	candy.row = emptyCell[1];
	candy.id = 100;
	candy.prev = 0;
}

function Start() {
	audio.pause();
    audio.currentTime = 0;
    audio.play();
    audio.volume = 0.1;

	context = canvas.getContext("2d");

	lifes = 20;
	board = new Array();
	score = 0;
	pac_color = "yellow";
	game_time = parseFloat(document.getElementById("timer").value);
	var cnt = 100;
	ghosts_amount = document.getElementById("monsters").value;
	var food_remain = document.getElementById("balls").value;
	var food_5_points_remain = Math.floor(food_remain * 0.6);//5 in board
	var food_15_points_remain = Math.floor(food_remain * 0.3);//15 in board
	var food_25_points_remain = food_remain - food_5_points_remain - food_15_points_remain;//25 in board
	var food_remain_list = {"food_5_points_remain": food_5_points_remain, "food_15_points_remain": food_15_points_remain, "food_25_points_remain": food_25_points_remain};
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < boardLength; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < boardLength; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 4 && j == 5) ||
				(i == 4 && j == 6) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2) ||
				(i == 6 && j == 3)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					if("food_5_points_remain" in food_remain_list && food_remain_list["food_5_points_remain"] == 0){
						delete food_remain_list["food_5_points_remain"];
					}
					if("food_15_points_remain" in food_remain_list && food_remain_list["food_15_points_remain"] == 0){
						delete food_remain_list["food_15_points_remain"];
					}
					if("food_25_points_remain" in food_remain_list && food_remain_list["food_25_points_remain"] == 0){
						delete food_remain_list["food_25_points_remain"];
					}
					
					var index = Math.floor(Math.random() * Object.keys(food_remain_list).length);
					var keyString = Object.keys(food_remain_list)[index];// the key
					if(keyString == "food_5_points_remain"){
						board[i][j] = 5;
					}
					else if(keyString == "food_15_points_remain"){
						board[i][j] = 15;
					}
					else{
						board[i][j] = 25;
					}
					food_remain--;
					food_remain_list[keyString]--;
					
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while(food_remain > 0){
		if ("food_5_points_remain" in food_remain_list && food_remain_list["food_5_points_remain"] > 0){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 5;
			food_remain_list["food_5_points_remain"]--;
			food_remain--;
		}
		if ("food_15_points_remain" in food_remain_list && food_remain_list["food_15_points_remain"] > 0){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 15;
			food_remain_list["food_15_points_remain"]--;
			food_remain--;
		}
		if("food_25_points_remain" in food_remain_list && food_remain_list["food_25_points_remain"] > 0){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 25;
			food_remain_list["food_25_points_remain"]--;
			food_remain--;
		}
	}

	initialGhosts(board);
	initialCandy(board);
	initialStrawberry(board);
	initialHeart(board);

	// initialPacman(board);
	while(pacman_remain>0){
		var emptyCell = findRandomEmptyCellPacman(board);	
		board[emptyCell[0]][emptyCell[1]] = 2;
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		pacman_remain--;
	}

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 150);
	ghostInterval = setInterval(updateGhostPosition, 700);
	strawInterval = setInterval(updateStrawPosition, 700);

}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * boardLength-1 + 1);
	var j = Math.floor(Math.random() * boardLength-1 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * boardLength-1 + 1);
		j = Math.floor(Math.random() * boardLength-1 + 1);
	}
	return [i, j];
}


function findRandomEmptyCellPacman(board) {
	var i = Math.floor(Math.random() * boardLength-1 + 1);
	var j = Math.floor(Math.random() * boardLength-1 + 1);
	while (board[i][j] != 0 || ghostPositions.includes([i,j])) {
		i = Math.floor(Math.random() * boardLength-1 + 1);
		j = Math.floor(Math.random() * boardLength-1 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[upArrow]) {
		keyboardDiraction = 1;
		return 1;
	}
	if (keysDown[downArrow]) {
		keyboardDiraction = 2;
		return 2;
	}
	if (keysDown[leftArrow]) {
		keyboardDiraction = 3;
		return 3;
	}
	if (keysDown[rightArrow]) {
		keyboardDiraction = 4;
		return 4;
	}
}



//updates
function updateStrawPosition(){
	var dir = getRandomDirS(focreStrawberry);
	board[focreStrawberry.col][focreStrawberry.row] = focreStrawberry.prev;
	focreStrawberry.prev =board[focreStrawberry.col][focreStrawberry.row];
	if(dir == 'left'){
		focreStrawberry.prev = board[(focreStrawberry.col)-1][focreStrawberry.row];
		focreStrawberry.col--;
	}
	else if(dir == 'right'){
		focreStrawberry.prev = board[(focreStrawberry.col)+1][focreStrawberry.row];
		focreStrawberry.col++;
	}
	else if(dir == 'up'){
		focreStrawberry.prev = board[focreStrawberry.col][(focreStrawberry.row)-1];
		focreStrawberry.row--;		
	}
	else{//down
		focreStrawberry.prev = board[focreStrawberry.col][(focreStrawberry.row)+1];
		focreStrawberry.row++;
	}

	if(board[focreStrawberry.col][focreStrawberry.row] == 2){ //meet pacman
		var cell = board[focreStrawberry.col][focreStrawberry.row];
		if(cell==5 || cell==15 || cell==25)
			score = score + cell +50;
		else{
			score = score + 50;
		}
		window.clearInterval(strawInterval);
		focreStrawberry.prev = 0;
		board[focreStrawberry.col][focreStrawberry.row] = 0;
		return; //pacman
	}
	board[focreStrawberry.col][focreStrawberry.row] = focreStrawberry.id;

}



function updateGhostPosition() {
	for(var m=0 ; m< ghosts_amount ; m++){
		board[listOfGhost[m].col][listOfGhost[m].row] = listOfGhost[m].prev;
		listOfGhost[m].prev = board[listOfGhost[m].col][listOfGhost[m].row]; //make prev be the step before change 

		var dir = getRandomDir(listOfGhost[m]);
		if(dir == 'left'){
			listOfGhost[m].prev = board[(listOfGhost[m].col)-1][listOfGhost[m].row];
			listOfGhost[m].col--;
		}
		else if(dir == 'right'){
			listOfGhost[m].prev = board[(listOfGhost[m].col)+1][listOfGhost[m].row];
			listOfGhost[m].col++;
		}
		else if(dir == 'up'){
			listOfGhost[m].prev = board[listOfGhost[m].col][(listOfGhost[m].row)-1];
			listOfGhost[m].row--;		
		}
		else{//down
			listOfGhost[m].prev = board[listOfGhost[m].col][(listOfGhost[m].row)+1];
			listOfGhost[m].row++;
		}
		
		//if g meets pacman in the next step
		if(board[listOfGhost[m].col][listOfGhost[m].row] ==2){ 
			// listOfGhost[m].prev = 0;
			for(var x=0 ; x< ghosts_amount ; x++){
				board[listOfGhost[x].col][listOfGhost[x].row] = listOfGhost[x].prev;
			}
			initialGhosts(board);
			board[shape.i][shape.j]= 0 ;
			var emptyCell = findRandomEmptyCellPacman(board);	
			board[emptyCell[0]][emptyCell[1]] = 2;
			shape.i = emptyCell[0];
			shape.j = emptyCell[1];
			// pacman_remain--;

			catchPacman();
	
		
		}
		else{
		board[listOfGhost[m].col][listOfGhost[m].row] = listOfGhost[m].id;
		}

	}
	
}


function UpdatePosition() {

	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {//up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {//down
		if (shape.j < boardLength-1 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {//left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {//right
		if (shape.i < boardLength-1 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	//food- upgrade score by points
	if (board[shape.i][shape.j] == 5 || board[shape.i][shape.j] == 15 || board[shape.i][shape.j] == 25) {
		score = score + board[shape.i][shape.j];
	}

	//ghost- take off one live and init the positions
	if (board[shape.i][shape.j] == 6 || board[shape.i][shape.j] == 7 || board[shape.i][shape.j] == 8  || board[shape.i][shape.j] == 9) {
		catchPacman();
	}
	
	//straw 
	if(board[shape.i][shape.j] == 50){
		score = score + 50;
		window.clearInterval(strawInterval);
	}

	//heart
	if(board[shape.i][shape.j] == 100){
		lifes++;
		board[shape.i][shape.j] = 0;
	}

	//candy
	if(board[shape.i][shape.j] == 200){
		var num = Math.floor(Math.random() * 1);
		if (num == 0){
			lifes--;
		}
		else{
			lifes++;
		}
		board[shape.i][shape.j] = 0;
	}



	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;

	if ( time_elapsed >= game_time ){
		window.clearInterval(interval);
		window.clearInterval(ghostInterval);
		window.clearInterval(strawInterval);
		if(score > 100){
			alert('Loser!')
		}
		else
			alert('Winner!')
	}
	

	else {
		Draw();
	}
}


function Draw() {
	
	canvas.width = canvas.width; //clean board
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	lblScore.value = score;
	lblTime.value =  (game_time - time_elapsed).toFixed(2);
	for (var i = 0; i < boardLength; i++) {
		for (var j = 0; j < boardLength; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //pacman
				//we want to find the direction to draw the pacman				
				if (keyboardDiraction == 1) //up
				{ //up
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.70 * Math.PI , 1.30 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 12, center.y , 5,2 * Math.PI, 0); // circle
					context.fillStyle = "black"; //color	
					context.fill();
				}
				else if (keyboardDiraction == 2){ //down
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.65 * Math.PI , 0.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 12, center.y , 5,2 * Math.PI, 0); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
				else if (keyboardDiraction == 3)
				{ //left
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.2 * Math.PI , 0.88 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 5, center.y - 15, 5, 0,2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				} 
				else if (keyboardDiraction == 4){//right
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.2 * Math.PI, 1.88 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
					initPacmanDir = 0;
				}
			} else if (board[i][j] == 5) {
				//color5
				context.beginPath();
				context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("color5").value; //color
				context.fill();
				
			} else if (board[i][j] == 15) {
				//color15
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("color15").value; //color
				context.fill();
			} else if (board[i][j] == 25) {
				//color25
			
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = document.getElementById("color25").value; //color
				context.arc.shadowBlur = 1;
				context.arc.shadowColor = "white";
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			//monsters -  add check pos for animation
			} else if (board[i][j] == 6) {
				context.drawImage(listOfGhost[0].img , center.x-30, center.y-30 ,60,60);
				
			} else if (board[i][j] == 7) {
				context.drawImage(listOfGhost[1].img, center.x-30, center.y-30 ,60,60);
	
			} else if (board[i][j] == 8) {
				context.drawImage(listOfGhost[2].img, center.x-30, center.y-30 ,60,60);
				
			} else if (board[i][j] == 9) {
				context.drawImage(listOfGhost[3].img, center.x-30, center.y-30 ,60,60);
			}
	        else if (board[i][j] == 50) {
				// context.shadowBlur = 5;
				// context.shadowColor = "white";
				context.drawImage(focreStrawberry.img, center.x-30, center.y-30 ,60,60);
			}
			else if (board[i][j] == 100) {
				context.drawImage(heart.img, center.x-30, center.y-30 ,60,60);
			}

			else if (board[i][j] == 200) {
				context.drawImage(candy.img, center.x-30, center.y-30 ,60,60);
			}

		}
	}
}




//shayyyy try to fix bug in tut if there's a prom it's here
	function getRandomDirS(straw){
		var ghostCol = straw.col;
		var ghostRow = straw.row;
	
		var move = [];
			if(ghostRow-1 >= 0 && !(ghostPositions.includes(board[ghostCol][ghostRow-1])) && !(notValidMove.includes(board[ghostCol][ghostRow-1]))){
				move.push('up');
			}
		else if(ghostRow+1 < !(boardLength && ghostPositions.includes(board[ghostCol][ghostRow+1])) && !(notValidMove.includes(board[ghostCol][ghostRow+1]))){
				move.push("down")
			}
	
		if(ghostCol-1 >= 0 && !(ghostPositions.includes(board[ghostCol-1][ghostRow])) && !(notValidMove.includes(board[ghostCol-1][ghostRow]))){
				move.push("left");
			}
		else if(ghostCol+1 < boardLength && !(ghostPositions.includes(board[ghostCol+1][ghostRow])) && !(notValidMove.includes(board[ghostCol+1][ghostRow]))){
				move.push("right");
			}
		
			// get random index value
			const randomIndex = Math.floor(Math.random() * move.length);
			// get random item
			const item = move[randomIndex];
			return item;
	}

	function catchPacman(){
		lifes--;
		score=score-10;
		//pacman set
		
	
		if (lifes == 0){
			audio.pause();
			window.clearInterval(interval);
			window.clearInterval(ghostInterval);
			window.clearInterval(strawInterval);
			alert('GAME OVER');
	
		}
	}
	

function getRandomDir(ghost){
	var pacmanCol = shape.i;
	var pacmanRow = shape.j;
	var ghostCol = ghost.col;
	var ghostRow = ghost.row;

	var move = [];
	if (ghostRow > pacmanRow) {
		if(ghostRow-1 >= 0 && !(notValidMove.includes(board[ghostCol][ghostRow-1]))){
			move.push('up');
		}
	} else if (ghostRow < pacmanRow) {
		if(ghostRow+1 < boardLength && !(notValidMove.includes(board[ghostCol][ghostRow+1]))){
			move.push("down")
		}
	}
	if (ghostCol > pacmanCol) {
		if(ghostCol-1 >= 0 && !(notValidMove.includes(board[ghostCol-1][ghostRow]))){
			move.push("left");
		}
	} else if (ghostCol < pacmanCol) {
		if(ghostCol+1 < boardLength && !(notValidMove.includes(board[ghostCol+1][ghostRow]))){
			move.push("right");
		}
	}
		 // get random index value
		 const randomIndex = Math.floor(Math.random() * move.length);
		// get random item
		const item = move[randomIndex];
		return item;
}


//validation with jquery
$(document).ready(function() {
	// register
	$("#register_form").validate({
	rules: {
		username : {
		required: true,
		checkFreeName: true
		},

		password: {
		required: true,
		minlength: 6,
		ContainsAtLeastOneDigitLetter: true
		},

		firstname : {
		required: true,
		lettersonly: true
		},
		lastname : {
		required: true,
		lettersonly: true
		},
	
		email: {
		required: true,
		email: true
		},
		birthdate: {
		required: true
		}
	},
	messages : {
		username:{
		checkFreeName: "User name is not available"

		},
		password: {
			ContainsAtLeastOneDigitLetter: "Password must contain letters and digits",
			minlength: "Password should be at least 6 characters"
			},

		firstname: {
		lettersonly: "First Name should be letters only"
		},
		lastname: {
		lettersonly: "Last Name should be letters only"
		},
	
		email: {
		email: "The email should be in the format: abc@domain.tld"
		}
	}, 
	submitHandler: function() {
		submit();
		show('welcome');
		let form = $("#register_form");
		form[0].reset();
		}
	});
//login
	$("#login_form").validate({
		rules: {
			username_login : {
			required: true,
			},
	
			password_login: {
			required: true,
			passwordValid: true
			},
		},
		messages : {
			username_login:{
			},
			password_login: {
			passwordValid: "Invalid password for this user"

			},
		}, 
		submitHandler: function() {
			alert('hello');
			backToConfig();
			let form = $("#login_form");
			form[0].reset();
			}
		});
	});

$(function() {

		$.validator.addMethod("passwordValid", function() {
			var username = document.getElementById("username_login").value;
			var password = document.getElementById("password_login").value;
			var storagePass = "";
			for (var i = 0; i < listOfUsers.length; i++) {
				if (listOfUsers[i][0] == username) {
					if (listOfUsers[i][1] == password) {
						storagePass = listOfUsers[i][1];
						break;
					}
				}
			}
			if (storagePass=="") {
				return false;
			}
				return true;
			
		});
		

	$.validator.addMethod("lettersonly", function(value, element)
	{
	if(this.optional(element) || /^[a-z ]+$/i.test(value)){
		return true;
	}
	return false;
	});

	$.validator.addMethod("checkFreeName", function(value){
		for (var i = 0; i < listOfUsers.length; i++) {
			if (listOfUsers[i][0] == value) {
				return false;
			}
			}
	
		return true;
	

	});

	$.validator.addMethod("ContainsAtLeastOneDigitLetter", function(value) 
	{ 
	if(/[a-z].[0-9]|[0-9].[a-z]/i.test(value)){
		return true;
	} 
	return false;
	});
});

// page switch
function show(page)
{   
	$('.content').replaceWith($('.page').html());​
	// document.getElementById('content').innerHTML = document.getElementById('page').innerHTML;
}



// function show(target){
//     // hideAllPages();//hide all pages
//     document.getElementById(container).innerHTML = document.getElementById(target);//show selected page
//     return false;//cancel page navigation
// }

// function hideAllPages(){
//     var pages = document.getElementsByClassName("pages");
//     for(var i = 0; i < pages.length; i++){
//         pages[i].style.display = 'none';
//     }
// }


function submit(){
	var usernameInput = document.getElementById("username").value;
	var passwordInput = document.getElementById("password").value;
	listOfUsers.push([usernameInput, passwordInput]);
	alert('Succesfully registered');
}

function cancleReg(){
	show('welcome');
			let form = $("#login_form");
			form[0].reset();
}



// register form- show password
function showPassword() {
	var x = document.getElementById("password");
	if (x.type === "password") {
	  x.type = "text";
	} else {
	  x.type = "password";
	}
}

function chosenNumberBalls(val) {
	document.getElementById("numberballs").innerHTML = val;  
	document.getElementById("numberballs").display("block");
}

function chosenNumberMonsters(val) {
	document.getElementById("numbermonsters").innerHTML = val;
	document.getElementById("numbermonsters").display("block");
}

function random(){
	document.getElementById('right').value = "ArrowRight"; 
	document.getElementById('left').value = "ArrowLeft";
	document.getElementById('up').value = "ArrowUp";
	document.getElementById('down').value = "ArrowDown";
	document.getElementById('color5').value = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	document.getElementById('color15').value = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	document.getElementById('color25').value = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	document.getElementById('timer').value = Math.floor(Math.random() * (1000 - 700 + 1) ) + 60;
	document.getElementById('balls').value = Math.floor(Math.random() * (90 - 50 + 1) ) + 50;
	document.getElementById('numberballs').innerHTML = document.getElementById('balls').value; 
	document.getElementById('monsters').value = Math.floor(Math.random() * (4 - 1 + 1) ) + 1;
	document.getElementById('numbermonsters').innerHTML = document.getElementById('monsters').value; 
}

// set keyboard User
function setFitKey(direction, event){
	if (direction == 'left') {
		leftArrow = event.keyCode;
		document.getElementById('left').value = event.key;
	}
	if (direction == 'right') {
		rightArrow = event.keyCode;
		document.getElementById('right').value = event.key;
	}
	if (direction == 'up') {
		upArrow = event.keyCode;
		document.getElementById('up').value = event.key;
	}
	if (direction == 'down') {
		downArrow = event.keyCode;
		document.getElementById('down').value = event.key;
	}
}


function updateAttributes(target){
	document.getElementById(target).style.display = 'block';//show selected page
	const inputs = document.querySelectorAll('input.configBtn');
	inputs.forEach(input => input.disabled = true);
	Start();
}

function backToConfig(){
	const inputs = document.querySelectorAll('input.configBtn');
	inputs.forEach(input => input.disabled = false);
	show('configuration');
}