var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded

/*
router.get('/room_debug', function(req, res){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
});
*/

router.post('/createRoom', function(req, res){

});

router.get('/getRoomList', function(req, res){

});

module.exports = router;
