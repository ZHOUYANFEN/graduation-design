//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'login': 'modules/user'
	},
	waitSeconds: 0
});

require(['jquery', 'config'], function($, config){
	var lock = false;
	$('#main-content #confirm-button').on('click', function(){
		if (!lock){
			lock = true;
			$.ajax({
				url: config['api']['user']['update'][0],
				type: config['api']['user']['update'][1],
				data: {

				},
				dataType: 'json',
				timeout: 10000,
				error: function(err){
					console.log(err);
					alert('连接服务器出错！');
				},
				success: function(data){
					console.log(data);
				}
			});
		}
	});

});
