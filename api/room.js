var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var	cookieParser = require('cookie-parser');
var crypto = require('crypto');

var roomList = [];	//all rooms

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
	if (roomId.length > 20){
		roomId = roomId.substr(0,20);
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
		members: []
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

});


/*
router.get('/room_debug', function(req, res){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
});
*/

module.exports = router;
