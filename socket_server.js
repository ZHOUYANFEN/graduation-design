var socketio = require('socket.io'),
	io,		//socket.io main entrance
	getInfoBySocketId = {};	//{'socketId': {roomId:'roomId', userId:'userId', userName:'userName'}}


//return all members in this room to the client
function getRoomMembers(roomId){
	var room_members = [];		
	var allSocketsInRoom = io.sockets.adapter.rooms[roomId].sockets;
	for (var socketId in allSocketsInRoom){
		//one user may have several sockets at the same time, get rid of the repetition
		var flag = true;
		for (var i = 0; i < room_members.length; i++) {
			if (room_members[i]['userId'] == getInfoBySocketId[socketId]['userId']){
				flag = false;
				break;
			}
		}
		if (flag){
			room_members.push({
				userId: getInfoBySocketId[socketId]['userId'],
				userName: getInfoBySocketId[socketId]['userName']
			})
		}
	}
	//send to client
	io.sockets.in(roomId).emit('room members', {
		code: 1,
		room: room_members 
	});
}


exports.listen = function(server){
	//start the socket.io server
	io = socketio(server);

	io.sockets.on('connection', function(socket){
		//socket disconnect, send message to client
		socket.on('disconnect', function(){
			var socketInfo = getInfoBySocketId[socket.id];
				/*
			for (var socketId in getInfoBySocketId){
			}
				*/

			if (socketInfo){
				io.sockets.in(socketInfo['roomId']).emit('member leave', {
					code: 1,
					member: {
						userId: socketInfo['userId'],
						userName: socketInfo['userName']
					}	
				})
				delete getInfoBySocketId[socket.id];
			}
		});

		//initially clinet send (roomId, userId and userName)
		socket.on('initialize', function(data){
			//add this new socket to the 'getInfoBySocketId' varible
			getInfoBySocketId[socket.id] = {
				roomId: data['roomId'],
				userId: data['userId'],
				userName: data['userName']
			}

			//add this socket to socket room/group named by the 'roomId'
			socket.join(data['roomId']);

			//return all members in this room to the client
			getRoomMembers(data['roomId']);
		});
	});
}