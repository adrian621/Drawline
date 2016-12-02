//Import module express and setup express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});
var draw_Control = require('./drawControl');
var user_Control = require('./userControl');

//Reading and writing files
var fs = require('fs');

//specify folder to use for static pagaes such as css scripts
app.use(express.static('public'));

//Handle all get requests from clients.
//send the html file

app.get('*', function(req, res){
	var file = req.params[0];
	res.sendFile(__dirname + '/public/views/' + file);
});

//Set up server to listen to port 2000
server.listen(process.env.PORT || 2000);
console.log('server is running');

var c = read_canvas();

io.sockets.on('connection', function(socket){
console.log('client connected');


	//Standard syntax for socket (type(drawControl or userSocket) {data});
	socket.on('drawControl', function(data){
	//skicka data till modul drawfunctions
		draw_Control.drawFunctions(data, socket, io);
	});

	socket.on('userControl', function(data){
		user_Control.userFunctions(data, socket, io);
	});

	socket.on('disconnect', function(){
		user_Control.userFunctions({type: 'userDisconnect'}, socket, io);
	});

	socket.on('canvas', function(data){
		c = data;

		//Save canvas' dataURL on server locally.
		save_canvas();
	});

	socket.on('wantCanvas', function(){
		socket.emit('latestCanvas', c);
	});

});

function save_canvas(){
	fs.writeFile("./canvasDataURL.txt", c, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

function read_canvas(){
 var canvas_dataURL;
	try{
		canvas_dataURL = fs.readFileSync('./canvasDataURL.txt','utf8');

	}catch(err) {
		console.log(err);
		return;
	}

	return canvas_dataURL;
}
