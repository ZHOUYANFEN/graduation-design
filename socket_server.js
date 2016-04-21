var deleteRoom = require('./api/room').deleteRoom,
	socketio = require('socket.io'),
	io,		//socket.io main function 
	getPaintingByRoomId = {},	//all painting message in one room
	getInfoBySocketId = {};	//{'socketId': {roomId:'roomId', userId:'userId', userName:'userName'}}


exports.listen = function(server){
	//start the socket.io server
	io = socketio(server);


	io.sockets.on('connection', function(socket){
		//initially clinet send (roomId, userId and userName)
		socket.on('initialize', function(data){
			//add this new socket to the 'getInfoBySocketId' varible
			var repetition = false;		//check whether it's a repetition
			for (var socketId in getInfoBySocketId){
				if (getInfoBySocketId[socketId]['userId'] == data['userId']){
					repetition = true;
					break;
				}
			}
			getInfoBySocketId[socket.id] = {
				roomId: data['roomId'],
				userId: data['userId'],
				userName: data['userName'],
				repetition: repetition
			}
			//add this socket to socket room/group named by the 'roomId'
			socket.join(data['roomId']);

			//send the message of all members as well as the new one in this room to the client
			var room_members = [];		
			var allSocketsInRoom = io.sockets.adapter.rooms[data['roomId']].sockets;
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
			//send to all clients in this room
			io.sockets.in(data['roomId']).emit('room members', {
				code: 1,
				newMember: {
					userId: data['userId'],
					userName: data['userName'],
					repetition: repetition
				},
				room: room_members 
			});
			//send painting data of this room to the client
			if (getPaintingByRoomId[data['roomId']]){
				socket.emit('room painting data', getPaintingByRoomId[data['roomId']]);
			}
		});

		//receive the chatting message ,and boardcast it
		socket.on('chatting message', function(data){
			socket.in(data['roomId']).emit('chatting message', data);
		});

		//member start painting
		socket.on('start painting', function(data){
			socket.in(data['roomId']).emit('start painting', data);
		});

		//member finish painting
		socket.on('finish painting', function(data){
			socket.in(data['roomId']).emit('finish painting', data['userId']);
		});

		//receive the paintting message, save and boardcast it
		socket.on('painting', function(data){
			socket.in(data['roomId']).emit('painting', data);

			if (!getPaintingByRoomId[data['roomId']]){
				getPaintingByRoomId[data['roomId']] = [];
			}
			getPaintingByRoomId[data['roomId']].push(data);
		});

		//socket disconnect, send leaving member's message to client
		socket.on('disconnect', function(){
			var socketInfo = getInfoBySocketId[socket.id];
			if (socketInfo){
				io.sockets.in(socketInfo['roomId']).emit('member leave', {
					code: 1,
					member: {
						userId: socketInfo['userId'],
						userName: socketInfo['userName'],
						repetition: socketInfo['repetition']
					}	
				});
				//if the value is 'undefined', it means no sockets are in this room, delete this room in 'api/room'
				if (!io.sockets.adapter.rooms[socketInfo['roomId']]){
					deleteRoom(socketInfo['roomId']);
				}
				delete getInfoBySocketId[socket.id];
				delete getPaintingByRoomId[socketInfo['roomId']];
			}
		});
	});
}