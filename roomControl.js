var allRooms = [];
var room_control = module.exports = {};
var draw_Control = require('./drawControl');


room_control.roomFunctions = function(data, socket, io){



	switch (data.type) {
		case 'needList':
		var names = getRoomNames();
		console.log("skickar roomnames" + names);
		socket.emit('listOfRooms',{roomNames:names});
		break;
		
		case 'newRoom':		
		console.log('newRoomCreated');
		var id = newRoom(data.roomName);
		io.emit('addNewRoomToAllUsers', {id:id, roomName: data.roomName});
		socket.join(id);		
		break;
		
		case 'joinRoom':
		var id = joinRoom(data.roomName);
		socket.join(data.roomName);
		console.log('user named' + socket.id + "joined room" + data.roomName);	
	}
}	


room = function(id, name){
	var room={
		name: name,
		id: id,
		users: [],
		canvas: draw_Control.newCanvas(),				
		};
		
		allRooms[allRooms.length] = room;	
}

joinRoom = function(roomName){	
	for(var i = 0; i < allRooms.length; i++){
		if(roomName == allRooms[i].name){
			return allRooms[i].id;
			}
		}	
	console.log("cant find room");			
}

newRoom = function(name){
	var id = (Math.random() * 1000).toFixed();
	console.log("creating room with name" + name);
	room(id, name);
	return id;
}

getRoomNames = function(){
var roomsNames = [];
for	(var i = 0; i < allRooms.length; i++){
		roomsNames.push(allRooms[i].name);
	}
	return roomsNames;
}

/*
user = function(){
var user = {
	
	
};	
	all
}
*/
