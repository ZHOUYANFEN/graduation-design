//模块配置信息
require.config({
	//baseUrl: "./",
	paths: {
		//工具模块
		'jquery': 'tools/jquery.min',
		'bootstrap': 'tools/bootstrap.min',
		'handlebars': 'tools/handlebars',

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
									$('#roomModal .error').html('<span>连接服务器出错</span>');
									error_reset();
									window.location.reload();	
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

//生成首页房间列表(包括切换标签)
require(['jquery', 'config', 'handlebars'], function($, config, Handlebars){
	var all_rooms_count = 0;	//the number of all rooms which have been loaded
	var load_more_lock = true;
	function getRoomList(skip, total, roomKind){
		load_more_lock = true;
		$('#room-list-area .no-room').css('display', 'none');
		$('#load-more').css('display', 'block');
		$('#load-more h3').text('加载中...');

		$.ajax({
			url: config['api']['room']['getRoomList'][0],
			type: config['api']['room']['getRoomList'][1],
			data: {
				skip: skip,
				total: total,
				roomKind: roomKind
			},
			dataType: 'json',
			timeout: 10000,
			error: function(err){
				console.log(err);
				alert('连接服务器出错！');
			},
			success: function(data){
				var roomList = data['roomList'];
				var template = Handlebars.compile( $('#room-template').html() );

				if (roomList.length == 0 && skip == 0){		//load first time
					$('#room-list-area .no-room').css('display', 'block');
					$('#load-more').css('display', 'none');
				}else if (roomList.length ==0){		//all rooms have been loaded
					$('#load-more h3').text('已全部加载');
				}else{
					var rows = Math.ceil(roomList.length / 4);	//how many rows that these rooms need
					var index = 0;
					var html = '';

					for (var i = 0; i < rows; i++) {
						var cnt = 0;
						html += '<div class="row">';
						for (var j = index; j < roomList.length; j++) {
							if (cnt == 4){
								break;
							}
							html += template(roomList[j]);
							index ++;
							cnt ++;
							all_rooms_count ++;
						}
						html += '</div>';
					}
					$('#room-list-area').append(html);
					$('#load-more h3').text('加载更多');
					load_more_lock = false;
				}
			}
		});
	}


	function hashToRoomKind(urlHash){
		var roomKind;
		switch(urlHash){
			case '#senior':
				roomKind = '高中';
				break;
			case '#junior':
				roomKind = '初中';
				break;
			case '#primary':
				roomKind = '小学';
				break;
			case '#others':
				roomKind = '其它';
				break;
			default:
				roomKind = '全部';
		}
		return roomKind;	
	}
	var roomKind = hashToRoomKind(window.location.hash);
	//initial loading
	getRoomList(0, 8, roomKind);

	$('#load-more h3').on('click', function(){
		if (!load_more_lock && $(this).text() != '已全部加载'){
			getRoomList(all_rooms_count, 8, roomKind);
		}
	});
	//change roomkind, reloading
	window.onhashchange = function(){
		roomKind = hashToRoomKind(window.location.hash);
		all_rooms_count = 0;
		$('#room-list-area .col').remove();
		getRoomList(0, 8, roomKind);
	}
});
