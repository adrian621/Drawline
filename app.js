
//Import module express and setup express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});

//specifie folder to use for static pagaes such as css scripts
app.use(express.static('public'));

//Handele all get requests from clients.
//send the html file

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/views/index.html');
	
});

//Set up server to listen to port 2000
server.listen(process.env.PORT || 2000);
console.log('server is running');

io.sockets.on('connection', function(socket){
	console.log('client connected');
			
});
