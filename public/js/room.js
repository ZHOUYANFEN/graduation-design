//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',
		'handlebars': 'tools/handlebars',
		'socket_io': 'tools/socket.io',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'top_bar_userinfo': 'modules/user',
		'mouse_draw': 'modules/mouse_draw',
		'canvas_paint': 'modules/canvas_paint',
		'socket': 'modules/socket'
	},
	waitSeconds: 0
});

//加载socket模块
require(['socket'], function(socket){
	socket.init();	//启动socket连接，绑定初始化事件
});

//画布与调色板初始化，绑定鼠标移动事件
require(['mouse_draw', 'canvas_paint'], function(mouse_draw, canvas_paint){
	mouse_draw.init();
	canvas_paint.init();
});

//右上角个人信息
require(['top_bar_userinfo'], function(top_bar_userinfo){
	top_bar_userinfo();
});

//左上角房间信息
require(['jquery', 'config', 'handlebars'], function($, config, Handlebars){
	$.ajax({
		url: config['api']['room']['getRoomInfo'][0],
		type: config['api']['room']['getRoomInfo'][1],
		data: {
			roomId: window.location.href.split(/roomId=/)[1]
		},
		dataType: 'json',
		timeout: 10000,
		error: function(err){
			if (err['status'] == 403 && err['responseJSON']['description'] == 'romm has been deleted'){
				alert('房间已被删除!');
				window.removeEventListener('beforeunload', beforeunloadHandle);
				window.location.href = '/index.html';	
			}
		},
		success: function(data){
			var template = Handlebars.compile( $('#roomInfo-template').html() );
			var html = template(data['room']);
			$('#main-content .left .room-info').html(html);
		}
	});
});

