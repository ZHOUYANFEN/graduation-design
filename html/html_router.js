//handling all HTML documents' requests
var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser');
var router = express.Router();

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
		res.sendFile(path.join(__dirname, 'room.html'));
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


module.exports = router;
