var user_Control = module.exports = {};

user_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				//add user to list of users
				addToUserList(data, socket);
				//add user vote list of users
				initUserVote(socket);
				//send new userList to all clients
				io.emit('onlineUsers', {users:onlineUsers.userNames});
				break;

			case 'userChange':
				changeUserVote(socket);
				checkUsersVotes();
				//Finns nog bättre ställe att sätta den:
				checkIfChangable(io);
				break;

			case 'userDisconnect':
				removeFromUserList(socket, io);
				removeUserVote(socket);
				break;
			}
}

var onlineUsers = {
	userNames:[],
	ids:[],
};

var onlineUsersVote = {
	ids:[],
	votes:[],
};

// ************ FUNCTIONS FOR HANDLING USERS VOTES       ***************************
initUserVote = function(socket) {
	onlineUsersVote.ids.push(socket.id);
	onlineUsersVote.votes.push(false);
	console.log(onlineUsersVote.votes);
}


removeUserVote = function(socket) {
	for (var i = 0; i < onlineUsersVote.votes.length; i++) {
		if(onlineUsersVote.ids[i] == socket.id) {
			onlineUsersVote.votes.splice(i,1);
			onlineUsersVote.ids.splice(i,1);
			console.log(onlineUsersVote.votes);
			return;
		}
	}
}

changeUserVote = function(socket) {
	//Go through all users and find the one who changes their mind.
	for (var i = 0; i < onlineUsersVote.votes.length; i++) {
		//When the user is find change the vote to the opposite of what it is.
		if(onlineUsersVote.ids[i] == socket.id) {
			onlineUsersVote.votes[i] = !onlineUsersVote.votes[i];
			console.log(onlineUsers.userNames);
			console.log(onlineUsersVote.votes);
			return;
		}
	}
}

//Returns the % of TRUE votes.
//This is done by dividing the amount of TRUE votes with the number of online users.
checkUsersVotes = function() {
	var userAmount = onlineUsersVote.votes.length;
	var trueVotes = 0;

	for(var i=0; i<userAmount; i++) {
		if(onlineUsersVote.votes[i] == true) {
			trueVotes++;
		}
	}
	return (trueVotes/userAmount);
}

checkIfChangable = function(io) {
	if(checkUsersVotes() > 0.5) {
		io.emit('ext_clear');
	}
}

// ************ FUNCTIONS FOR HANDLING USERNAMES AND IDS ***************************

addToUserList = function(data, socket){
	onlineUsers.userNames.push(data.username);
	console.log(onlineUsers.userNames);
	onlineUsers.ids.push(socket.id);
}

removeFromUserList = function(data, io){
	for (var i = 0; i < onlineUsers.userNames.length; i++) {		
		if (onlineUsers.ids[i] == data.id) {
			 //console.log("CLIENT " + onlineUsers[i].id +" DISCONNECTED AND WAS REMOVED");
			 onlineUsers.ids.splice(i, 1);
			 onlineUsers.userNames.splice(i, 1);
			 console.log(onlineUsers.userNames);
			 io.emit('onlineUsers', {users:onlineUsers.userNames});
			 return;
		}
	}
}
