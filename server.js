var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),
	api_router = require('./api/api_router');
	
var	app = express(),
	port = process.env.PORT || 8080;	//端口号，默认8080，可以用命令行传参 PORT=3000

//连接mongoDB
mongoose.connect('mongodb://localhost:27017/graduation-design');
var db = mongoose.connection;

db.on('err', function(err){
	console.log('Connect MongoDB error! Err: ' + err);
});
db.once('open', function(){
	console.log('Successfully connect MongoDB!');
});


app.use(express.static(path.join(__dirname, 'public')));	//托管public文件夹下静态页面
app.use('/api', api_router);	//api入口路由模块


//启动服务器
var server = app.listen(port, function () {
  var host = server.address().address;
  console.log('Example app listening at http://%s:%s', host, port);
});
