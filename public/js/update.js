//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',

		//功能模块
		'config': 'modules/config',
		'cookie': 'modules/cookie',
		'top_bar_userinfo': 'modules/user'
	},
	waitSeconds: 0
});

//右上角个人信息
require(['top_bar_userinfo'], function(top_bar_userinfo){
	top_bar_userinfo();
});

//修改名字，手机号，邮箱
require(['jquery', 'config', 'cookie'], function($, config, cookie){
	var userId = cookie.getCookie('userId'),
		userName = cookie.getCookie('userName'),
		userEmail = cookie.getCookie('userEmail'),
		userPhone = cookie.getCookie('userPhone');
	$('.updateInfo #updateName').val(userName);
	$('.updateInfo #updateEmail').val(userEmail);
	$('.updateInfo #updatePhone').val(userPhone);

	var lock = false;
	$('#main-content #confirm-button').on('click', function(){	//点击修改按钮
		var newName = $('.updateInfo #updateName').val(),
			newEmail = $('.updateInfo #updateEmail').val(),
			newPhone = $('.updateInfo #updatePhone').val();
		var update_content = {};

		if (newName == ''){
			alert('用户名不能为空');
			return ;
		}else if (newName != userName){
			update_content.name = newName;
		}
		if (newPhone == ''){
			alert('手机号不能为空');
			return ;
		}else if (!newPhone.match(/^\d{11}$/)){
			alert('手机号格式错误');
			return ;		
		}else if (newPhone != userPhone){
			update_content.phone = newPhone;
		}
		if (newEmail == ''){
			alert('邮箱不能为空');
			return ;
		}else if (!newEmail.match(/^(\w|\.)+@{1}(\w|\.)+$/)){		//邮箱格式错误
			alert('邮箱格式错误!');
			return ;
		}else if (newEmail != userEmail){
			update_content.email = newEmail;
		}

		var isEmpty = true;		//没有信息修改
		for (var i in update_content){
			isEmpty = false;
			break;
		}

		if (!lock && !isEmpty){
			lock = true;
			$.ajax({
				url: config['api']['user']['update'][0],
				type: config['api']['user']['update'][1],
				data: {
					userId: userId,
					update_content: update_content
				},
				dataType: 'json',
				timeout: 10000,
				error: function(err){
					lock = false;	//解锁

					//名字，手机号，邮箱已存在
					if (err.responseJSON.description == 'user exists' && err.status == 403){
						var errors = err.responseJSON.errors;
						var error_text = '';
						if (errors.length == 1){
							error_text = '该' + errors[0] + '已被注册';
						}else{
							error_text += '该' + errors[0];
							for (var i = 1; i < errors.length; i++){
								error_text += '，' + errors[i];
							}
							error_text += '已被注册';
						}
						alert(error_text);
					}else{
						alert('服务器出错');
					}
				},
				success: function(data){
					lock = false;

					console.log(data);
					cookie.setCookie('userName', newName);
					cookie.setCookie('userEmail', newEmail);
					cookie.setCookie('userPhone', newPhone);
					alert('修改成功');
					window.location.href = '/index.html';
				}
			});
		}
	});
});
