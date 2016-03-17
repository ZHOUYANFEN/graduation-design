//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
	}
});

//个人信息
require(['jquery'], function($){
	var cnt = 0;
	$('#top-bar .right h3').on('mouseenter', function(event){
		var $hidden = $(this).parent().find('.hidden_first');
		$hidden.css('display', 'block');

		$hidden.one('mouseenter', function(){
			cnt ++;
		});
		$hidden.one('mouseleave', function(){
			$hidden.css('display', 'none');
			cnt = 0;
		});
	});


	$('#top-bar .right').on('mouseleave', function(event){
		console.log(cnt)
		if (cnt == 0){
			$(this).find('.hidden_first').css('display', 'none');
		}
	});
});