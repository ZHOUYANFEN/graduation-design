var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var	cookieParser = require('cookie-parser');
var crypto = require('crypto');

var roomList = [];	//all rooms information

router.use(cookieParser());
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded

//whether this user has created a room
router.get('/hasCreatedRoom', function(req, res){
	var userId = req.query.userId;

	for (var i = 0; i < roomList.length; i++) {
		if (roomList[i]['ownerUserId'] == userId){
			res.status(200).send({
				code: 1,
				description: 'yes',
				user_data: {
					roomId: roomList[i]['roomId'] 
				}
			});
			return ;
		}
	}
	res.status(200).send({
		code: 1,
		description: 'no'
	});
});

//create a new room
router.post('/createRoom', function(req, res){
	var roomName = req.body.roomName,
		roomKind = req.body.roomKind,
		roomDescription = req.body.roomDescription;
	var	roomId = crypto.createHash('sha256').update( new Date().getTime().toString() ).digest('hex');
	if (roomId.length > 15){
		roomId = roomId.substr(0,15);
	}	
	var userId = unescape(req.cookies.userId),
		userName = unescape(req.cookies.userName);

	for (var i = 0; i < roomList.length; i++) {
		if (roomList[i]['ownerUserId'] == userId){
			res.status(403).send({
				code: 0,
				description: 'user has already created a room',
				user_data: {
					roomId: roomList[i]['roomId'] 
				}
			});
			return ;
		}
	}
	var newRoom = {
		ownerUserId: userId,
		ownUserName: userName,
		roomId: roomId,
		roomName: roomName,
		roomKind: roomKind,
		roomDescription: roomDescription,
		//members: []
	}
	roomList.push(newRoom);

	res.status(200).send({
		code: 1,
		description: 'create room successfully',
		user_data: {
			roomId: roomId
		}
	});
});

//get all rooms exist
router.get('/getRoomList', function(req, res){
	var skip, total;
	if (req.query.skip.match(/\d+/) && req.query.total.match(/\d+/)){
		skip = parseInt(req.query.skip);
		total = parseInt(req.query.total);
	}else{
		res.status(403).send({
			code: 0,
			description: 'parameters wrong'
		});
	}

	var roomKind = req.query.roomKind;
	var roomList_classify = [];
	if (roomKind == '全部'){
		roomList_classify = roomList;
	}else{
		for (var i = 0; i < roomList.length; i++) {
			if (roomList[i]['roomKind'] == roomKind){
				roomList_classify.push(roomList[i]);
			}
		}
	}

	if (skip > roomList_classify.length){
		res.status(200).send({
			code: 1,
			roomList: []
		});
	}else if (skip + total > roomList_classify.length){
		var rooms = [];
		for (var i = skip; i < roomList_classify.length; i++) {
			rooms.push(roomList_classify[i]);
		}
		res.status(200).send({
			code: 1,
			roomList: rooms
		});
	}else{
		var rooms = [];
		for (var i = skip; i < skip + total; i++) {
			rooms.push(roomList_classify[i]);
		}
		res.status(200).send({
			code: 1,
			roomList: rooms
		});
	}
});

//get one room's information
router.get('/getRoomInfo', function(req, res){
	var roomId = req.query.roomId;
	for (var i = 0; i < roomList.length; i++) {
		if (roomId == roomList[i]['roomId']){
			res.status(200).send({
				code: 1,
				room: roomList[i]
			});
			return ;
		}
	}
	res.status(403).send({
		code: 0,
		description: 'romm has been deleted'
	});
});


exports.ifRoomExist = function(roomId){
	for (var i = 0; i < roomList.length; i++) {
		if (roomId == roomList[i]['roomId']){
			return 'yes';
		}
	}
	return 'no';
}

exports.deleteRoom = function(roomId){
	for (var i = 0; i < roomList.length; i++) {
		if (roomList[i]['roomId'] == roomId){
			roomList.splice(i, 1);
		}
	}
}

//module.exports = router;
exports.router = router;	//express's router for room api