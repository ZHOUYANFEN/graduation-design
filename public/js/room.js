//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

		//功能模块
		'mouse_draw': 'modules/mouse_draw',
		'canvas_paint': 'modules/canvas_paint'
	}
});
//初始化
require(['mouse_draw', 'canvas_paint'], function(mouse_draw, canvas_paint){
	mouse_draw.init();
	canvas_paint.init();
});

// require(['canvas_paint'], function(canvas_paint){
// 	canvas_paint();
// });

