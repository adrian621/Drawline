var user_Control = module.exports = {};
var draw_Control = require('./drawControl');

user_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				//add user to list of users
				addToUserList(data, socket);
				//add user vote list of users
				initUserVote(socket);
				//send new userList to all clients
				io.emit('onlineUsers', {users:onlineUsers.userNames});
				//send new vote stats to all clients
				io.emit('voteStats', checkUsersVotes());
				break;

			case 'userChange':
				changeUserVote(socket, io);
				checkUsersVotes();
				//Finns nog bättre ställe att sätta den:
				checkIfChangable(io, socket);
				break;

			case 'userDisconnect':
				removeFromUserList(socket, io);
				break;
			}
}

var onlineUsers = {
	userNames:[],
	ids:[],
	votes:[],
};

var unlineUsersVote = {
	ids:[],
	votes:[],
};

// ************ FUNCTIONS FOR HANDLING USERS VOTES       ***************************
initUserVote = function(socket) {
	onlineUsers.votes.push(false);
	socket.emit('curr_vote', false);
}





changeUserVote = function(socket, io) {
	//Go through all users and find the one who changes their mind.
	for (var i = 0; i < onlineUsers.votes.length; i++) {
		//When the user is find change the vote to the opposite of what it is.
		if(onlineUsers.ids[i] == socket.id) {
			onlineUsers.votes[i] = !onlineUsers.votes[i];
			socket.emit('curr_vote', onlineUsers.votes[i]);
			io.emit('voteStats', checkUsersVotes());
			return;
		}
	}
}

setAllFalse = function(io) {
	for(var i=0; i<onlineUsers.votes.length; i++) {
		onlineUsers.votes[i] = false;
		io.emit('curr_vote', false);
	}
}

//Returns the % of TRUE votes.
//This is done by dividing the amount of TRUE votes with the number of online users.
checkUsersVotes = function() {
	var userAmount = onlineUsers.votes.length;
	var trueVotes = 0;

	for(var i=0; i<userAmount; i++) {
		if(onlineUsers.votes[i] == true) {
			trueVotes++;
		}
	}

	if(trueVotes/userAmount == null)
		return 0;

	return (trueVotes/userAmount);
}

checkIfChangable = function(io) {
	if(checkUsersVotes() > 0.5) {
		setAllFalse(io);
		io.emit('ext_clear');
		io.emit('voteStats', checkUsersVotes());
		draw_Control.clearCanvas();
	}
}

// ************ FUNCTIONS FOR HANDLING USERNAMES AND IDS ***************************

addToUserList = function(data, socket){
	username = checkUserNameValidity(data.username);
	onlineUsers.userNames.push(username);
	//console.log(onlineUsers.userNames);
	onlineUsers.ids.push(socket.id);

}

checkUserNameValidity = function(username){
console.log(username);
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


removeFromUserList = function(data, io){
	for (var i = 0; i < onlineUsers.userNames.length; i++) {
		if (onlineUsers.ids[i] == data.id) {
			 //console.log("CLIENT " + onlineUsers[i].id +" DISCONNECTED AND WAS REMOVED");
			 onlineUsers.ids.splice(i, 1);
			 onlineUsers.userNames.splice(i, 1);
			 onlineUsers.votes.splice(i,1);
			 io.emit('onlineUsers', {users:onlineUsers.userNames});
			 return;
		}
	}
}
