define('socket', ['config', 'jquery', 'socket_io', 'handlebars', 'cookie', 'canvas_paint'], 
		function(config, $, io, Handlebars, cookie, canvas_paint){

	var socket;
	var roomId = window.location.href.split(/roomId=/)[1],		//房间id
		userId = cookie.getCookie('userId'),		//当前用户信息
		userName = cookie.getCookie('userName');

	window.beforeunloadHandle = function(event){		//离开房间beforeunload事件，句柄使用全局变量
		var confirm ='若你是该房间中最后一个成员，你离开时房间将被删除';
		event.returnValue = confirm;
		return confirm;
	}
	window.addEventListener('beforeunload', beforeunloadHandle);



	return {
		init: function(){
			var host = config['host'];
			socket = io('http://' + host + ':8080');	//连接socket服务器


			//发送初始化数据到socket服务器
			socket.emit('initialize', {
			 	roomId : roomId,
				userId: userId,
				userName: userName
			});

			//获取房间中成员列表信息+新成员信息
			var template = Handlebars.compile( $('#members-template').html() );
			socket.on('room members', function(data){
				for (var i = 0; i < data['room'].length; i++) {
					if (data['room'][i]['userId'] == userId){	//自己
						data['room'][i]['userName'] = '我';
						break;
					}
				}
				var html = template(data['room']);
				$('#main-content .left .members').html(html);
				//此时再显示房间聊天区，避免高度跳动
				$('#main-content .left .chatting').css('display', 'block');

				//聊天区成员新进入房间提示(需根据repetition判断是否重复)
				if (!data['newMember']['repetition']){
					var newMemberName = data['newMember']['userName'];
					if (data['newMember']['userId'] == userId){		//自己
						newMemberName = '我';
					}else if (newMemberName.length > 9){
						newMemberName = newMemberName.substr(0, 9) + '...';
					}
					var enterMessage = '<li class="join"><span data-user_id="'
										+ data['newMember']['userId']
										+ '">'
										+ newMemberName 
										+ '</span><p>进入房间</p></li>';
					$('#main-content .left #message-area ul').append(enterMessage);
					//滚动到底部
					$('#main-content .left #message-area').animate({scrollTop: $('#main-content .left #message-area ul').height()+'px'}, 400);
				}
			});

			//房间中有成员离开
			socket.on('member leave', function(data){
				//同一浏览器，同一用户的其它标签页离开，所有标签页重定向到首页，离开房间
				if (data['member']['userId'] == cookie.getCookie('userId')){
					//先解绑beforeunload事件
					window.removeEventListener('beforeunload', beforeunloadHandle);
					window.location.href = '/index.html';
				}else if (!data['member']['repetition']){	//repetition为false，更新左侧房间成员列表
					$('#main-content .left .members li').each(function(){
						if ($(this).data('user_id') == data['member']['userId']){
							$(this).remove();
						}
					});

					var leaveMemberName = data['member']['userName'];
					if (leaveMemberName.length > 9){
						leaveMemberName = leaveMemberName.substr(0, 9) + '...';
					}
					var leavemessage = '<li class="leave"><span data-user_id="'
										+ data['member']['userId']
										+ '">'
										+ leaveMemberName 
										+ '</span><p>离开房间</p></li>';
					$('#main-content .left #message-area ul').append(leavemessage);
					$('#main-content .left #message-area').animate({scrollTop: $('#main-content .left #message-area ul').height()+'px'}, 400);
				}
			});

			//某成员开始绘图
			socket.on('start painting', function(data){
				console.log(data);
			});
			//某成员结束绘图
			socket.on('finish painting', function(data){
				console.log(data);
			});
			//接收画笔信息
			socket.on('painting', function(data){
				canvas_paint.draw_line(data['coor_queue'], data['palette']);
			});

			//接收聊天区信息
			socket.on('chatting message', function(data){
				var receive_message;
				if (data['userId'] == userId){	//自己另外的标签页发的信息
					receive_message = '<li class="message"><span class="me" data-user_id="'
										+ userId
										+ '">我：</span><p>'
										+ data['message']
										+ '</p></li>';
				}else{
					receive_message = '<li class="message"><span data-user_id="'
										+ userId
										+ '">' + data['userName'] + '：</span><p>'
										+ data['message']
										+ '</p></li>';
				}
				$('#main-content .left #message-area ul').append(receive_message);
				$('#main-content .left #message-area').animate({scrollTop: $('#main-content .left #message-area ul').height()+'px'}, 400);
			});

			//聊天框发送信息
			$('#main-content .left #write-message button').on('click', function(event){
				var text = $('#main-content .left #write-message textarea').val();
				if (text == ''){
					alert('聊天内容不能为空'); 
					return ;
				}else if (text.match(/(<|>)/)){		//XSS过滤输入
					text = text.replace(/[<>"&]/g, function(match, pos, originalText){
						switch(match){
							case '<':
								return '&lt;';
							case '>':
								return '&gt;';
							case '&':
								return '&amp;';
							case '\"':
								return '&quot;';
						}
					});
				}
				$('#main-content .left #write-message textarea').val('');
				socket.emit('chatting message', {
				 	roomId : roomId,
					userId: userId,
					userName: userName,
					message: text
				});

				var mymessage = '<li class="message"><span class="me" data-user_id="'
									+ userId
									+ '">我：</span><p>'
									+ text
									+ '</p></li>';
				$('#main-content .left #message-area ul').append(mymessage);
				$('#main-content .left #message-area').animate({scrollTop: $('#main-content .left #message-area ul').height()+'px'}, 400);
			});

			//textarea聚焦时，监听回车键
			$('#main-content .left #write-message textarea')
			.on('focus', function(){
				$(window).on('keydown', function(event){
					var keyCode = event.keyCode;
					if (keyCode == 13){		//回车键
						event.preventDefault();
						$('#main-content .left #write-message button').click();
					}
				});
			}).on('blur', function(){
				$(window).unbind('keydown');
			});
		},
		socket_object: function(){
			return socket;
		}
	}
});