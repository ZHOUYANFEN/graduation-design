define('socket', ['jquery', 'socket_io', 'cookie', 'handlebars'], function($, io, cookie, Handlebars){
	var socket;
	var roomId = window.location.href.split(/roomId=/)[1];		//房间id
	var beforeunloadHandle = function(event){		//离开房间beforeunload事件
		var confirm ='若你是该房间中最后一个成员，你离开时房间将被删除';
		event.returnValue = confirm;
		return confirm;
	}
	// window.addEventListener('beforeunload', beforeunloadHandle);

	return {
		init: function(){
			socket = io('http://localhost:8080');

			//发送初始化数据到socket服务器
			socket.emit('initialize', {
			 	roomId : roomId,
				userId: cookie.getCookie('userId'),
				userName: cookie.getCookie('userName')
			});
			//获取房间中成员列表信息+新成员信息
			socket.on('room members', function(data){
				var template = Handlebars.compile( $('#members-template').html() );
				var html = template(data['room']);
				$('#main-content .left .members').html(html);
				//显示房间聊天区，此时再js控制显示，避免高度跳动
				$('#main-content .left .chatting').css('display', 'block');
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
					console.log(data['member']['userName'] + ' leave room');
				}
			});
		},
		socket_object: function(){
			return socket;
		}
	}
});