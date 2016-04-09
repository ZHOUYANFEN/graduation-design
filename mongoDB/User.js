var mongoose = require('mongoose'),
	crypto = require('crypto');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	phone: {
		type: Number,
		unique: true
	},
	password: String
});

UserSchema.static({
	findByName: function(name, cb){
		return this.find({name: name}, cb);
	},
	findByEmail: function(email, cb){
		return this.find({email: email}, cb);
	},
	findByPhone: function(phone, cb){
		return this.find({phone: phone}, cb);
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
