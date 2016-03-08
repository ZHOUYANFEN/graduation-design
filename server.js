var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;	//端口号，默认8080，可以用命令行传参 PORT=3000

var app = express();
//托管public文件夹下静态页面
app.use(express.static(path.join(__dirname, 'public')));

//重定向默认路径到public/index.html
app.get('/', function (req, res) {
  //res.send('express example hello world!');
  res.redirect('index.html');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
