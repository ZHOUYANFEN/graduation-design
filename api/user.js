var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
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
		if (err){	//error handle
			res.status(500).send(err);
			return ;
		}

		if (found.length !== 0){	
			res.status(403).send({
				code: 0,
				description: 'email already exists'
			})
			return ;
		}
		User.findByPhone(phone, function(err2, found2){
			if (err2){	//error handle
				res.status(500).send(err);
				return ;
			}

			if (found2.length !== 0){
				res.status(403).send({
					code: 0,
					description: 'phone already exists'
				})
				return ;
			}

			//this user haven't been regsiter yet, add him to the database
			var	hash = crypto.createHash('sha256').update( new Date().getTime().toString() ).digest('hex');
			if (hash.length > 15){
				hash = hash.substr(0,15);
			}			
			var new_user = new User({
				name: '新用户' + hash,
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
					description: 'register successfully'
				});

			});

		})
	});
});

//user log in
router.post('/log', function(req, res){
	var login_callback = function(err, found){
		if (err){	//error handle
			res.status(500).send(err);
			return ;
		}
		if (found.length > 0){
			var user_found= found[0];
			var user_password = user_found['password'];
			if (user_password !== password){	//password incorrect
				res.status(403).send({
					code: 0,
					description: 'password incorrect'
				});
			}else{		//password correct, log in successfully
				res.status(200).send({
					code: 1,
					description: 'log in successfully',
					user_data: {
						_id: user_found['_id'],
						name: user_found['name'],
						email: user_found['email'],
						phone: user_found['phone'],
					}
				});
			}
		}
		else{	//user doesn't exist
			res.status(403).send({
				code: 0,
				description: 'account does not exist'
			});	
		}
	}

	var account = req.body.account,
		password = req.body.password;

	if (account.match(/.+@.+/)){			//email
		User.findByEmail(account, login_callback);
	}else if (account.match(/^\d{11}$/)){	//phone
		User.findByPhone(account, login_callback);
	}else{									//name
		User.findByName(account, login_callback);
	}
});

//user update information
router.post('/update', function(req, res){

});


module.exports = router;
