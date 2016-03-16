define('register', ['jquery', 'config'], function($, config){
	var reg_lock = false;
	return function(){
		$('.main-submit').on('click', function(event){
			var email = $('#regEmail').val();
			var phone = $('#regPhone').val();
			var password = $('#regPassword').val();
			var password2 = $('#regPassword2').val();

			if (!reg_lock){
				reg_lock = true;
				$.ajax({
					url: '/api/user/reg',
					type: 'POST',
					data: {
						email: email,
						phone: phone,
						password: password
					},
					dataType: 'json',
					timeout: 10000,
					error: function(err){
						reg_lock = false;
						console.log('ajax error!');
						console.log(err);
					},
					success: function(data){
						reg_lock = false;
						console.log(data);
					}
				});
			}
		});
	};
});

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
					timeout: 5000,
					error: function(err){
						login_lock = false;
						var description = err['responseJSON']['description'];
						if (description == 'account does not exist'){
							$('.main .error:eq(0)').html('<span>账号不存在</span>');
						}else if (description = 'password incorrect'){
							$('.main .error:eq(1)').html('<span>密码错误</span>');
						}else{
							$('.main .error:eq(1)').html('<span>连接服务器出错</span>');
						}

						error_reset();
					},
					success: function(data){
						login_lock = false;
						console.log(data);
						/*
							do something
						*/
					}
				});
			}
			else if (!flag){
				error_reset();
			}
		});
	};
});