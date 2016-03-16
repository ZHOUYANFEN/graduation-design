var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/graduation-design');

var db = mongoose.connection;

db.on('err', function(){
	console.log(err);
});

db.once('open', function(){
	console.log('hahaha connect!!');
});
/*******************************************/

var kittySchema = mongoose.Schema({
    name: String
});
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('debug', kittySchema);

var fluffy = new Kitten({ name: 'fluffy' });

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak(); // "Meow name is fluffy"
});


Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
});

//Kitten.find({ name: /^Fluff/ }, callback);