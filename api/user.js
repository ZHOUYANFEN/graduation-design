var express = require('express');
var router = express.Router();

router.get('/user_debug', function(req, res, next){
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
});


module.exports = router;
