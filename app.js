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

var rtt = 0;
var clients = [];
var clientid;

io.sockets.on('connection', function(socket){
	console.log('client connected');

	//Check round trip time for client
	socket.on('RTTcheck', function (startTime, cb) {
	  cb(startTime);
	});

	//Set var rtt to client's round trip time
	socket.on('RTT', function(data){
		rtt = data;
	});

	//Get client's ID and add to client list
	socket.on('clientid', function(data){
		clientid = data;
		clients.push(data);
		console.log(clients);
	});

	//remove client from clientlist when disconnected
	socket.on('disconnect', function(){
		var index = clients.indexOf(clientid);
		clients.splice(index, 1);
	})
	//Standard syntax for socket (type(drawControl or userSocket) {data});
	socket.on('drawControl', function(data){
	//skicka data till modul drawfunctions
		draw_Control.drawFunctions(data, socket, io, rtt);
	});

	socket.on('userControl', function(data){
		draw_Control.userFunctions(data, socket, io);
		});

});
