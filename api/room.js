var express = require('express');
var router = express.Router();

router.get('/room_debug', function(req, res){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
});


module.exports = router;
