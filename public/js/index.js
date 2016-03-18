//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'top_bar_user': 'modules/user'
	}
});

//右上角个人信息
require(['top_bar_user'], function(top_bar_user){
	top_bar_user();
});