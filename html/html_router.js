//handling all HTML documents' requests
var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser');
var router = express.Router();
var addUserToRoom = require('../api/room').addUserToRoom;

router.use(cookieParser());


router.get(/^(\/{1}|(\/index.html))$/, function(req, res){
	if (!req.cookies.userId){		//haven't logged in yet
		res.redirect('/log.html');
	}else{
		res.sendFile(path.join(__dirname, 'index.html'));
	}
});

router.get('/room.html', function(req, res){
	if (!req.cookies.userId){
		res.redirect('/log.html');
	}else{
		var roomId = req.query.roomId;
		var user = {
			userId:  unescape(req.cookies.userId),
			userName: unescape(req.cookies.userName)
		}
		var result = addUserToRoom(user, roomId);
		if (result == 'room does not exist'){//room Id is something wrong
			res.status(404).send('Room does not exist!');
		}else{
			res.sendFile(path.join(__dirname, 'room.html'));
		}
	}
});

router.get('/log.html', function(req, res){
	if (!req.cookies.userId){
		res.sendFile(path.join(__dirname, 'log.html'));
	}else{
		res.redirect('/index.html');
	}
});

router.get('/reg.html', function(req, res){
	if (!req.cookies.userId){
		res.sendFile(path.join(__dirname, 'reg.html'));
	}else{
		res.redirect('/index.html');
	}
});

router.get('/changePass.html', function(req, res){
	if (req.cookies.userId){
		res.sendFile(path.join(__dirname, 'changePass.html'));
	}else{
		res.redirect('/log.html');
	}
});


module.exports = router;
