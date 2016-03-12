//the entrance module of all APIs
var express = require('express');
var router = express.Router();

var user_router = require('./user/user_router');
var room_router = require('./room/room_router');

router.use('/user', user_router);
router.use('/room', room_router);

/*
router.get('/debug', function(req, res, next){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
	//  /api, /api/debug, /debug
});
*/

module.exports = router;
