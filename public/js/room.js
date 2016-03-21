//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

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

