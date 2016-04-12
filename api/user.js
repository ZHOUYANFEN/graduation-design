var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var User = require('../mongoDB/User');	//mongoDB module

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded


//user register
router.post('/reg', function(req, res){
	var email = req.body.email,
		phone = req.body.phone,
		password = req.body.password;
	var password_hash = crypto.createHash('md5').update(password).digest('hex');

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
			var	hash = crypto.createHash('md5').update( new Date().getTime().toString() ).digest('hex');
			if (hash.length > 15){
				hash = hash.substr(0,15);
			}			
			var new_user = new User({
				name: '新用户' + hash,
				email: email,
				phone: phone,
				password: password_hash
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
			if (user_password !== password_hash){	//password incorrect
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
	var password_hash = crypto.createHash('md5').update(password).digest('hex');


	if (account.match(/^(\w|\.)+@{1}(\w|\.)+$/)){			//email
		User.findByEmail(account, login_callback);
	}else if (account.match(/^\d{11}$/)){	//phone
		User.findByPhone(account, login_callback);
	}else{									//name
		User.findByName(account, login_callback);
	}
});

//user change password
router.post('/changePass', function(req, res){
	var _id = req.body.userId,
		oldPassword = req.body.oldPassword,
		newPassword = req.body.newPassword;
	var oldPassword_hash = crypto.createHash('md5').update(oldPassword).digest('hex'),
		newPassword_hash = crypto.createHash('md5').update(newPassword).digest('hex');

	User.findById(_id, function (err, found){
		if (err){	//userId incorrect
			res.status(403).send(err);
			return ;
		}
		if (oldPassword_hash !== found.password){
			res.status(403).send({
				code: 0,
				description: 'password incorrect'
			});
			return ;
		}else{		//update the DB
			User.update({_id: _id}, {password: newPassword_hash}, function(error, row){
				if (error){
					res.status(500).send(error);
					return ;
				}
				res.status(200).send({
					code: 1,
					description: 'change password successfully'
				});
			});
		}
	});
});

//user update information
router.post('/update', function(req, res){
	var _id = req.body.userId,
		update_content = req.body.update_content;

	var errors = [];
	var finish_count = 0,
		prop_count = 0;

	function finish_check(){
		finish_count ++;
		if (finish_count == prop_count){	//all check have been done
			if (errors.length > 0){	//errors, user already exist
				res.status(403).send({
					code: 0001,
					description: 'user exists',
					errors: errors
				});
			}else{	//update the database
				User.update({_id: _id}, update_content, function(err){
					if (err){
						res.status(500).send({
							description: 'database error',
							err: err
						})
						return ;
					}
					res.status(200).send({
						code: 1,
						description: 'update successfully'
					});
				});
			}
		}
	}

	for (var prop in update_content){
		prop_count ++;
		if (prop == 'name'){
			User.findByName(update_content.name, function(err, found){
				if (err){	//userId incorrect
					res.status(403).send(err);
					return ;
				}
				if (found.length !== 0){	//user name exist
					errors.push('用户名');
				}
				finish_check();
			})
		}else if (prop == 'phone'){
			User.findByPhone(update_content.phone, function(err, found){
				if (err){	
					res.status(403).send(err);
					return ;
				}
				if (found.length !== 0){	//user phone exist
					errors.push('手机号');
				}
				finish_check();
			})
		}else if (prop == 'email'){
			User.findByEmail(update_content.email, function(err, found){
				if (err){	
					res.status(403).send(err);
					return ;
				}
				if (found.length !== 0){	//user email exist
					errors.push('邮箱');
				}
				finish_check();
			})
		}
	}
});


module.exports = router;
