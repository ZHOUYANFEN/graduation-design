var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),
	html_router = require('./html/html_router'),
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
app.use(html_router);			//html文件路由模块


//启动服务器
var server = app.listen(port, function () {
	console.log('Server listening at http://localhost:%s', port);
});

//启动socket服务器监听
var socket_server = require('./socket_server');
socket_server.listen(server);