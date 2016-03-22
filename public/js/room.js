//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',
		'handlebars': 'tools/handlebars',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'top_bar_userinfo': 'modules/user',
		'mouse_draw': 'modules/mouse_draw',
		'canvas_paint': 'modules/canvas_paint'
	}
});
//右上角个人信息
require(['top_bar_userinfo'], function(top_bar_userinfo){
	top_bar_userinfo();
});

//画布与调色板初始化，绑定鼠标移动事件
require(['mouse_draw', 'canvas_paint'], function(mouse_draw, canvas_paint){
	mouse_draw.init();
	canvas_paint.init();
});

//初始化加载房间信息
require(['jquery', 'config', 'cookie', 'handlebars'], function($, config, cookie, Handlebars){
	var roomId = window.location.href.split(/roomId=/)[1];
	$.ajax({
		url: config['api']['room']['getRoomInfo'][0],
		type: config['api']['room']['getRoomInfo'][1],
		data: {
			roomId: roomId
		},
		dataType: 'json',
		timeout: 10000,
		error: function(err){
			alert('连接服务器出错！');
			console.log(err);			
		},
		success: function(data){
			var template = Handlebars.compile( $('#room-template').html() );
			var html = template(data['room']);
			$('#main-content .left .handlebars').html(html);
		}
	});
});



//离开房间操作，触发两事件
/*
require(['jquery', 'config'], function($, config){
	window.addEventListener("beforeunload", function (event) {
		var confirm ='若你是该房间中最后一个成员，你离开时房间将被删除';
		event.returnValue = confirm;     // Gecko, Trident, Chrome 34+
		return confirm;             	 // Gecko, WebKit, Chrome <34
	});

	window.addEventListener('unload', function(event){
		var roomId = window.location.href.split(/roomId=/)[1];
		console.log('fuckckckck')
		var test = $.ajax({
			url: config['api']['room']['getRoomInfo'][0],
			type: config['api']['room']['getRoomInfo'][1],
			data: {
				roomId: roomId
			},
			dataType: 'json',
			timeout: 10000,
			success: function(data){
				console.log(data)
			}
		});
	});
});

*/