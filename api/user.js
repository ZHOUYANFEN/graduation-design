var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../mongoDB/User');	//mongoDB module

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded

/*
router.get('/user_debug', function(req, res, next){
	// console.log(req.body)	// POST method
	// console.log(req.query)	// GET method
	res.send(req.baseUrl+', '+req.originalUrl+', '+req.url);
});
*/

//user register
router.post('/reg', function(req, res){
	var email = req.body.email,
		phone = req.body.phone,
		password = req.body.password;

	//query the DB first to check if this user already exists
	User.findByEmail(email, function(err, found){
		if (found.length !== 0){	
			res.status(403).send({
				code: 0,
				error: 'email already exists'
			})
			return ;
		}
		User.findByPhone(phone, function(err2, found2){
			if (found2.length !== 0){
				res.status(403).send({
					code: 0,
					error: 'phone already exists'
				})
				return ;
			}

			//this user haven't been regsiter yet, add him to the database
			var new_user = new User({
				email: email,
				phone: phone,
				password: password
			});

			new_user.save(function(err, new_user, flag){
				if (err){
					res.status(500).send(err);
					return ;
				}
				res.status(200).send({
					code: 1,
					text: 'register successfully'
				})
			});

		})
	});
});

//user log in
router.post('/log', function(req, res){
	
})


module.exports = router;
