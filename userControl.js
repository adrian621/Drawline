var user_Control = module.exports = {};
var draw_Control = require('./drawControl');
var roomControl = require('./roomControl');

var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://all:123@ds141428.mlab.com:41428/heroku_v9hdms3v';
var mongoDB;

//Connect to MongoDB
mongoClient.connect(url, function(err, db) {
	if(err) {
		console.log(err);
		return;
	}
	mongoDB = db;
});

user_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				if(data.username != undefined)
					socket.username = data.username;

				//add user to list of users
				addToUserList(data, socket);

				//add userName+socketID+ip-address to MongoDB
				var ip = socket.handshake.headers ['x-forwarded-for'];
				mongoDB.collection('User').insert({'user':data.username, 'socketID':socket.id, 'ip':ip});


				//send new userList to all clients
				var roomIndex = roomIndexOf(socket.curr_room);

				if(roomIndex == -1){
					return;
				}

				//add user vote list of users
				initUserVote(socket);


				io.sockets.in(socket.curr_room).emit('onlineUsers', {users:onlineUsers[roomIndex].userNames});
				//send new vote stats to all clients
				io.sockets.in(socket.curr_room).emit('voteStats', checkUsersVotes(socket));
			break;

			case 'userChange':
				changeUserVote(socket, io);
				checkUsersVotes(socket);
				//Finns nog bättre ställe att sätta den:
				checkIfChangable(io, socket);
			break;

			case 'userDisconnect':
				removeFromUserList(socket, io);
				//remove all entries from socket from MongoDB
				mongoDB.collection('User').remove({"socketID":socket.id});
				mongoDB.collection('UserMove').remove({"socketID":socket.id});
			break;
			}
}

//object array! one element for every room  like this: {
//	room: '',
//	userNames:[],
//	ids:[],
//	votes:[],
//}
var onlineUsers = [];


// ************ FUNCTIONS FOR HANDLING USERS VOTES       ***************************

initUserVote = function(socket) {
	var roomIndex = roomIndexOf(socket.curr_room);
	if(roomIndex == -1)
		return;

	onlineUsers[roomIndex].votes.push(false);

	socket.emit('curr_vote', false);
}

roomIndexOf = function(roomName){
	for(var i = 0; i < onlineUsers.length; i++){
		if(onlineUsers[i].room == roomName)
			return i;
	}

	return -1;
}
changeUserVote = function(socket, io) {

	var roomIndex = roomIndexOf(socket.curr_room);
	if(roomIndex == -1){
		return;
	}

	//Go through all users in this clients room and find the one who changes their mind.
	for (var i = 0; i < onlineUsers[roomIndex].votes.length; i++) {
		//When the user is find change the vote to the opposite of what it is.
		if(onlineUsers[roomIndex].ids[i] == socket.id) {
			onlineUsers[roomIndex].votes[i] = !onlineUsers[roomIndex].votes[i];
			socket.emit('curr_vote', onlineUsers[roomIndex].votes[i]);
			io.sockets.in(socket.curr_room).emit('voteStats', checkUsersVotes(socket));

			return;
		}
	}
}

setAllFalse = function(io, socket) {
	var roomIndex = roomIndexOf(socket.curr_room);

	if(roomIndex == -1)
		return;

	for(var i=0; i<onlineUsers[roomIndex].votes.length; i++) {
		onlineUsers[roomIndex].votes[i] = false;
		io.sockets.in(socket.curr_room).emit('curr_vote', false);
	}
}

//Returns the % of TRUE votes.
//This is done by dividing the amount of TRUE votes with the number of online users.
checkUsersVotes = function(socket) {
	var roomIndex = roomIndexOf(socket.curr_room);

	if(roomIndex == -1)
		return;

	var userAmount = onlineUsers[roomIndex].votes.length;
	var trueVotes = 0;

	for(var i=0; i<userAmount; i++) {
		if(onlineUsers[roomIndex].votes[i] == true) {
			trueVotes++;
		}
	}

	if(trueVotes/userAmount == null)
		return 0;

	return (trueVotes/userAmount);
}

checkIfChangable = function(io, socket) {
	if(checkUsersVotes(socket) > 0.5) {
		setAllFalse(io, socket);
		io.sockets.in(socket.curr_room).emit('ext_clear');
		io.sockets.in(socket.curr_room).emit('voteStats', checkUsersVotes(socket));
		draw_Control.clearCanvas(socket);
	}
}

// ************ FUNCTIONS FOR HANDLING USERNAMES AND IDS ***************************

//check if room is in onlineUsers. used to check if we need to add new room to onlineUsers
roomIsInList = function(roomName){
	for(var i = 0; i < onlineUsers.length; i++){
		if(onlineUsers[i].room == roomName)
			return true;
	}

	return false;
}


addToUserList = function(data, socket){
	var username = checkUserNameValidity(socket.username);

	//add room to onlineUsers if room is not already in list
	if(roomIsInList(socket.curr_room) == false){

		var newRoom = {room: socket.curr_room, userNames:[], ids:[], votes:[]};
		onlineUsers.push(newRoom);
	}

	var roomIndex = roomIndexOf(socket.curr_room);

	if(roomIndex == -1){
		return;
	}

	onlineUsers[roomIndex].userNames.push(username);

	onlineUsers[roomIndex].ids.push(socket.id);

}

checkUserNameValidity = function(username){

	if(username === undefined || username === null || username === ""){
		return "guest";
	}
	if(username.length > 10){
		return username.substring(0,10);
	}
	else{
		return username;
}


}


removeFromUserList = function(socket, io){
	var roomIndex = roomIndexOf(socket.curr_room);
	if(roomIndex == -1){
		return;
	}

	for (var i = 0; i < onlineUsers[roomIndex].userNames.length; i++) {

		if (onlineUsers[roomIndex].ids[i] == socket.id) {
			 //console.log("CLIENT " + onlineUsers[roomIndex].ids[i] +" DISCONNECTED AND WAS REMOVED");
			 onlineUsers[roomIndex].ids.splice(i, 1);
			 onlineUsers[roomIndex].userNames.splice(i, 1);
			 onlineUsers[roomIndex].votes.splice(i,1);
			 io.sockets.in(socket.curr_room).emit('onlineUsers', {users:onlineUsers[roomIndex].userNames});

			 //remove room from onlineusers if no clients are connected and isnt main room
			 if(onlineUsers[roomIndex].ids.length == 0 && onlineUsers[roomIndex].room != 'main')
			 	onlineUsers.splice(roomIndex,1);


			 return;
		}
	}

}
