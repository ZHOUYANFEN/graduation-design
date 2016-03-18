//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',
		'bootstrap': 'tools/bootstrap.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie'
	}
});


//创建房间的弹窗
require(['jquery', 'config'], function($, config){
	require(['bootstrap'], function(){	//需先加载完成jquery
		$('#roomModal .kinds').on('click', 'span', function(){
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');
		});

		//提交按钮
		var lock = false;
		$('#roomModal .main-submit').on('click', function(){
			var roomName = $('#roomModal #roomName').val(),
				roomKind = $('#roomModal .kinds .active').text(),
				roomDescription = $('#roomModal textarea').val();
			var flag = true;

			if (roomName == ''){
				alert('房间名不能为空！');
				flag = false;
			}
			if (flag && !lock){
				lock = true;
				$.ajax({
					url: config['api']['room']['createRoom'][0],
					type: config['api']['room']['createRoom'][1],
					data: {
						roomName: roomName,
						roomKind: roomKind,
						roomDescription: roomDescription
					},
					dataType: 'json',
					timeout: 10000,
					error: function(err){
						lock = false;		//unlock the request's lock
						// var description = err['responseJSON']['description'];
						// if (err.status == 403){
						// 	if (description == 'email already exists'){
						// 		$('.main .error:eq(0)').html('<span>该邮箱已注册</span>');
						// 	}
						// 	if (description == 'phone already exists'){
						// 		$('.main .error:eq(1)').html('<span>该手机号已注册</span>');
						// 	}
						// }
						// else{	
						// 	$('.main .error:eq(1)').html('<span>服务器出错</span>');
						// }
					},
					success: function(data){
						// console.log(data);
						// alert('注册成功！');
						// window.location.href = '/log.html';
					}
				});
			}
		});
	});
});


//右上角个人信息
require(['jquery', 'cookie'], function($, cookie){
	//加载用户名
	var userName = cookie.getCookie('userName');
	if (userName.length > 9){
		userName = userName.substr(0, 9) + '...';	
	}
	$('#top-bar .right h3').text(userName);
	
	//鼠标移动后，展开/隐藏
	var cnt = 0;
	$('#top-bar .right h3').on('mouseenter', function(event){
		var $hidden = $(this).parent().find('.hidden_first');
		$hidden.css('display', 'block');

		$hidden.unbind('mouseenter').one('mouseenter', function(){
			cnt ++;
		});
		$hidden.unbind('mouseleave').one('mouseleave', function(){
			$hidden.css('display', 'none');
			cnt = 0;
		});
	});
	$('#top-bar .right').on('mouseleave', function(event){
		if (cnt == 0){
			$(this).find('.hidden_first').css('display', 'none');
		}
	});

	//点击退出按钮
	$('#top-bar .right .hidden_first .quit').on('click', function(){
		cookie.clearAll();
		window.location.href = '/log.html';
	});
});

