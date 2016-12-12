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

//Read local server canvas at server startup
server.on('listening', function () {
    read_canvas();
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
		user_Control.userFunctions(data, socket, io);
	});

	socket.on('disconnect', function(){
		user_Control.userFunctions({type: 'userDisconnect'}, socket, io);
	});
});

//Save server canvas locally every 10 second
setInterval(function(){
	 save_canvas();
	 //read_canvas();
 }, 10000);

//Save server's canvas dataURL(string) locally on server
function save_canvas(){
	fs.writeFile('./canvasDataURL.txt', draw_Control.getServerCanvas(), function (err) {
  	if (err) throw err;
  console.log('Wrote to canvasDataURL.txt');
	});
}

//Sets server's canvas to canvasDataURL.txt. Used if restarting server/crash
function read_canvas(){

  fs.readFile('./canvasDataURL.txt', 'utf-8',  function (err, data) {
    if (err) console.log(err);

		if(data != undefined ){
	    console.log('Read canvasDataURL.txt');
			draw_Control.drawFunctions({type: 'serverStart', coord_data: data}, 0, io, 0);

		}
  });
}
