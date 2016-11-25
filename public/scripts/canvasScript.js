alert("1");

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", function(e){
	findMove('down', e)}, false);
canvas.addEventListener("mousemove", function(e){
	findMove('move', e)}, false);
canvas.addEventListener("mouseup", function(e){
	findMove('up', e)}, false);

var flag = false;
var prevCordX = 0;
var prevCordY = 0;
var newCordX = 0;
var newCordY = 0;
var dot_flag = false;
	
function findMove(res, e) {
	if(res == 'down') {
		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current mouse coordinates.
		newCordX = e.clientX;
		newCordY = e.clientY;
		
		flag = true;
		dot_flag = true;
			
		if(dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.fillRect = (newCordX, newCordY, 2, 2);
			ctx.closePath();
			dot_flag = false;
		}
	}

	if(res == 'up') {
		flag = false;
	}
		
	if(res == 'move' && flag) {
		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current mouse coordinates.
		newCordX = e.clientX;
		newCordY = e.clientY;
		//Draw everything
		draw();
		}
}

function draw() {
	ctx.beginPath();
	ctx.moveTo(prevCordX, prevCordY);
	ctx.lineTo(newCordX, newCordY);
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}