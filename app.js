//Import module express and setup express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressValidator = require('express-validator');
var bodyParser = require ('body-parser');
var draw_Control = require('./drawControl');
var user_Control = require('./userControl');

//All routes moved to this module.
//var routes = require('./routes')(app); will use this next push

//Reading and writing files
var fs = require('fs');

//Specifie the view engine. All views will be found in folder views and be ejs files.
app.set('view engine', 'ejs');


//specify folder to use for static pagaes such as css scripts
app.use(express.static('public'));

//Use body-parser to parse post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Express validator to validate usernames
app.use(expressValidator());

//Cookie-parser needed by session.
app.use(cookieParser());

//express-session to create
app.use(expressSession({
	secret:'max',
	saveUninitialized : true,
	resave: true}));

//handle canvas request if session is ok. Otherwise send index file.
app.get('/canvas', function(req, res, next){
	if(!req.session.username){
	res.redirect('/');
	}else
	{
	var file = req.params[0];
	var u = req.params.user_name;
	res.render('canvasView', {username: JSON.stringify(req.session.username)});
	req.session.destroy();
}
});


//send index file as standard for any request.
app.get('*', function(req, res, next){
	res.render('index');
});


//make new session when user is posted.
app.post('/username', function(req, res, next){
	/*
	req.check('user_name', 'invalid elol').isLength({min: 4});
	var errors = req.validationErrors();
	if(errors){
		console.log("sad");
		req.session.errors = errors;
	}
	*/
	var username = req.body.user_name;
	req.session.username = username;
	res.redirect('/canvas');
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

	socket.on('rot', function(data){
		console.log(data);
	})
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
