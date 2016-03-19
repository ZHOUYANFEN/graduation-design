//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',
		'bootstrap': 'tools/bootstrap.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'top_bar_userinfo': 'modules/user'
	}
});
//右上角个人信息
require(['top_bar_userinfo'], function(top_bar_userinfo){
	top_bar_userinfo();
});

//判断用户是否已经创建房间
require(['cookie', 'jquery', 'config'], function(cookie, $, config){
	$.ajax({
		url: config['api']['room']['hasCreatedRoom'][0],
		type: config['api']['room']['hasCreatedRoom'][1],
		data: {
			userId: cookie.getCookie('userId')
		},
		dataType: 'json',
		timeout: 10000,
		error: function(err){
			console.log(err);
			alert('连接服务器出错');
		},
		success: function(data){
			if (data.description == 'yes'){		//已创建
				$('#top-bar .medium .returnRoom').css('display', 'block');
				var href = '/room.html?roomId=' + data.user_data.roomId;
				$('#top-bar .medium .returnRoom a').attr('href', href);

			}else{		//未创建
				$('#top-bar .medium .createRoom').css('display', 'block');

				//创建房间的弹窗
				require(['bootstrap'], function(){	//需先加载完成jquery
					//分类标签的点击切换
					$('#roomModal .kinds').on('click', 'span', function(){
						$(this).parent().find('.active').removeClass('active');
						$(this).addClass('active');
					});

					//提交按钮
					var error_reset = function(){	//click other place to remove the error message
						setTimeout(function(){
							$(document).one('click', function(){
								$('#roomModal .error').html('');
							});
						}, 20);
					};
					var lock = false;
					$('#roomModal .main-submit').on('click', function(){
						var roomName = $('#roomModal #roomName').val(),
							roomKind = $('#roomModal .kinds .active').text(),
							roomDescription = $('#roomModal textarea').val();
						var flag = true;

						if (roomName == ''){
							$('#roomModal .error').html('<span>房间名不能为空</span>');
							error_reset();
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
									if (err.status == 403){	//already created a room
										$('#roomModal .error')
										.html('<span>你之前已创建房间！点击<a href="/room.html?roomId='
										 + err['responseJSON']['user_data']['roomId']
										 + '"> 这里 </a>进入</span>');
									}
									else{	
										$('#roomModal .error').html('<span>连接服务器出错</span>');
										error_reset();
									}
								},
								success: function(data){
									$('#roomModal .error').css('color', '#12B926').html('<span>创建成功，正在跳转到房间...</span>');
									var roomId = data['user_data']['roomId'];
									window.location.href = '/room.html?roomId=' + roomId;
								}
							});
						}
					});
				});
			}
		}
	});
});


