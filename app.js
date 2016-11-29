//Import module express and setup express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});

var draw_Control = require('./drawControl');


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

io.sockets.on('connection', function(socket){
	console.log('client connected');

	//Standard syntax for socket (type(drawControl or userSocket) {data});
	socket.on('drawControl', function(data){
	//skicka data till modul drawfunctions
		draw_Control.drawFunctions(data, socket, io);

	});

	socket.on('userControl', function(data){
		draw_Control.userFunctions(data, socket, io);
		});

});
