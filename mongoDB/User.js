var mongoose = require('mongoose'),
	crypto = require('crypto');

//根据时间戳产生hash
var date = new Date().getTime().toString(),
	date_hash = crypto.createHash('sha256').update(date).digest('hex');
if (date_hash.length > 20){
	date_hash = date_hash.substr(0,20);
}

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

UserSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
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
