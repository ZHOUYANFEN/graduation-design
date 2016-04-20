//注册模块
define('register', ['jquery', 'config', 'cookie'], function($, config, cookie){
	var error_reset = function(){	//click other place to remove the error message
		setTimeout(function(){
			$(document).one('click', function(){
				$('.main .error').html('');
			});
		}, 20);
	};
	var reg_lock = false;		//avoid users click many times,send lots of in a very short time

	return function(){
		$('.main-submit').on('click', function(event){
			var email = $('#regEmail').val();
			var phone = $('#regPhone').val();
			var password = $('#regPassword').val();
			var password2 = $('#regPassword2').val();
			var flag = true;

			if (email == ''){
				$('.main .error:eq(0)').html('<span>邮箱不能为空</span>');
				flag =false;
			}else{	//邮箱格式错误
				if (!email.match(/^(\w|\.)+@{1}(\w|\.)+$/)){
					$('.main .error:eq(0)').html('<span>邮箱格式错误</span>');
					flag =false;
				}
			}

			if (phone == ''){
				$('.main .error:eq(1)').html('<span>手机号不能为空</span>');
				flag = false;
			}else{
				if (!phone.match(/^\d{11}$/)){
					$('.main .error:eq(1)').html('<span>手机号格式错误</span>');
					flag =false;
				}
			}

			if (password == ''){
				$('.main .error:eq(2)').html('<span>密码不能为空</span>');
				flag = false;
			}
			if (password2 == ''){
				$('.main .error:eq(3)').html('<span>密码不能为空</span>');
				flag = false;
			}
			if (password != '' && password2 != '' && password != password2){
				$('.main .error:eq(3)').html('<span>两次输入密码不同</span>');
				flag = false;
			}

			if (!reg_lock && flag){
				reg_lock = true;
				$.ajax({
					url: config['api']['user']['reg'][0],
					type: config['api']['user']['reg'][1],
					data: {
						email: email,
						phone: phone,
						password: password
					},
					dataType: 'json',
					timeout: 10000,
					error: function(err){
						reg_lock = false;		//unlock the register request's lock
						var description = err['responseJSON']['description'];
						if (err.status == 403){
							if (description == 'email already exists'){
								$('.main .error:eq(0)').html('<span>该邮箱已注册</span>');
							}
							if (description == 'phone already exists'){
								$('.main .error:eq(1)').html('<span>该手机号已注册</span>');
							}
						}
						else{	
							$('.main .error:eq(1)').html('<span>服务器出错</span>');
						}

						error_reset();
					},
					success: function(data){
						console.log(data);
						alert('注册成功！');
						window.location.href = '/log.html';
					}
				});
			}
			else if (!flag){
				error_reset();
			}
		});
	};
});

//登录模块
define('login', ['jquery', 'config', 'cookie'], function($, config, cookie){
	var error_reset = function(){	//click other place to remove the error message
		setTimeout(function(){
			$(document).one('click', function(){
				$('.main .error').html('');
			});
		}, 20);
	};
	var login_lock = false;		//avoid users click many times,send lots of in a very short time

	return function(){
		$('.main-submit').on('click', function(event){
			var account = $('#logAccount').val();
			var password = $('#logPassword').val();
			var flag = true;

			if (account == ''){
				$('.main .error:eq(0)').html('<span>账号不能为空</span>');
				flag =false;
			}
			if (password == ''){
				$('.main .error:eq(1)').html('<span>密码不能为空</span>');
				flag = false;
			}

			if (!login_lock && flag){
				login_lock = true;
				$.ajax({
					url: config['api']['user']['log'][0],
					type: config['api']['user']['log'][1],
					data: {
						account: account,
						password: password
					},
					dataType: 'json',
					timeout: 10000,
					error: function(err){
						login_lock = false;		//unlock the login request's lock
						var description = err['responseJSON']['description'];
						if (description == 'account does not exist'){
							$('.main .error:eq(0)').html('<span>账号不存在</span>');
						}else if (description == 'password incorrect'){
							$('.main .error:eq(1)').html('<span>密码错误</span>');
						}else{
							$('.main .error:eq(1)').html('<span>连接服务器出错</span>');
						}

						error_reset();
					},
					success: function(data){
						console.log(data);
						$('.main .error:eq(1)').css('color', '#12B926').html('<span>登录成功，正在跳转到首页...</span>');

						cookie.clearAll();
						cookie.setCookie('userId', data.user_data._id);
						cookie.setCookie('userName', data.user_data.name);
						cookie.setCookie('userEmail', data.user_data.email);
						cookie.setCookie('userPhone', data.user_data.phone);
						window.location.href = '/index.html';
					}
				});
			}
			else if (!flag){
				error_reset();
			}
		});
	};
});

//修改密码模块
define('changePassword', ['jquery', 'config', 'cookie'], function($, config, cookie){
	var error_reset = function(){	//click other place to remove the error message
		setTimeout(function(){
			$(document).one('click', function(){
				$('.main .error').html('');
			});
		}, 20);
	};
	var change_lock = false;		//avoid users click many times,send lots of in a very short time

	return function(){
		$('.main-submit').on('click', function(event){
			var userId = cookie.getCookie('userId');
			var oldPassword = $('#oldPassword').val();
			var newPassword = $('#newPassword').val();
			var newPassword2 = $('#newPassword2').val();
			var flag = true;

			if (oldPassword == ''){
				$('.main .error:eq(0)').html('<span>旧密码不能为空</span>');
				flag =false;
			}
			if (newPassword == ''){
				$('.main .error:eq(1)').html('<span>新密码不能为空</span>');
				flag = false;
			}
			if (newPassword2 == ''){
				$('.main .error:eq(2)').html('<span>请再次输入新密码</span>');
				flag = false;
			}
			if (newPassword != '' && newPassword2 != '' && newPassword != newPassword2){
				$('.main .error:eq(2)').html('<span>两次输入新密码不同</span>');
				flag = false;
			}

			if (!change_lock && flag){
				change_lock = true;
				$.ajax({
					url: config['api']['user']['changePass'][0],
					type: config['api']['user']['changePass'][1],
					data: {
						userId: userId,
						oldPassword: oldPassword,
						newPassword: newPassword
					},
					dataType: 'json',
					timeout: 10000,
					error: function(err){
						change_lock = false;		//unlock the changePassword request's lock
						console.log(err)
						if (err.status == 403){	
							if (err['responseJSON']['description'] == 'password incorrect'){	//password incorrect
								$('.main .error:eq(0)').html('<span>旧密码错误</span>');
								error_reset();
							}else{
								//cookie has been overwrited by user
								alert('用户信息异常，请重新登录！');
								cookie.clearAll();
								window.location.href = '/log.html';
							}
						}else{
							$('.main .error:eq(1)').html('<span>连接服务器出错</span>');
							error_reset();
						}
					},
					success: function(data){
						console.log(data);
						$('.main .error:eq(2)').css('color', '#12B926').html('<span>修改成功，正在跳转到首页...</span>');
						window.location.href = '/index.html';
					}
				});
			}
			else if (!flag){
				error_reset();
			}
		});
	};
});

//右上角个人信息
define('top_bar_userinfo', ['jquery', 'cookie'], function($, cookie){
	return function(){
		//加载用户名
		var userName = cookie.getCookie('userName');
		if (userName.length > 8){
			userName = userName.substr(0, 8) + '...';	
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
	}
});