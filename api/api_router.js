//the entrance module of all APIs
var express = require('express');
var router = express.Router();

var user = require('./user');
var room = require('./room');

router.use('/user', user);
router.use('/room', room);

/*
router.get('/debug', function(req, res, next){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
	//  /api, /api/debug, /debug
});
*/

module.exports = router;
