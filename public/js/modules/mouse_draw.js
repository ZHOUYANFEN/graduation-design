define(['jquery', 'canvas_paint', 'socket', 'config', 'cookie'], function($, canvas_paint, socket_module, config, cookie){
	var socket = socket_module.socket_object(),		//socket.io中的socket句柄
		userId = cookie.getCookie('userId'),
		userName = cookie.getCookie('userName'),
		roomId = window.location.href.split(/roomId=/)[1];

	var coor_queue = [],	//鼠标移动路径的坐标队列
		num_to_draw = 5;	//坐标够多少个后开始绘制

	return {
		init: function(){
			var start_painting = true;
			//主画布上的mouse事件
			$('#main-content .center').on('mousedown', function(event1){
				var offsetLeft = $(this).offset().left,
					offsetTop = $(this).offset().top;
				var count = 0;

				$(this).on('mousemove', function(event2){	//记录鼠标移动轨迹
					var palette = canvas_paint.palette();	//画笔配置
					if (start_painting){
						start_painting = false;					
						//发送绘画人信息+绘画配置
						socket.emit('start painting', {
							roomId: roomId,
							userId: userId,
							userName: userName,
							palette: palette
						});
						//在成员列表中，添加正在绘图标示
						var $li = $('.left .members li[data-user_id="' + userId + '"]')
						$li.find('img')
						.attr('src', 'image/writing.gif')
						.addClass('writing');
					}

					var coor = {
						x: event2.pageX - offsetLeft,
						y: event2.pageY - offsetTop
					}
					coor_queue.push(coor);	//将坐标塞入队列
					count ++;

					if (count >= num_to_draw){	
						//socket发送画笔信息 + 坐标队列
						socket.emit('painting', {
							roomId: roomId,
							palette: palette,
							coor_queue: coor_queue
						});

						//本地绘制，调用canva_paint模块(顺序很重要！本地的一定要后于socket发送)
						canvas_paint.draw_line(coor_queue);

						coor_queue = [];	//清空队列
						count = 0;
					}
				});
			})
			.on('mouseleave', function(event){
				$(this).unbind('mousemove');	//解绑mousemove
				if (coor_queue.length > 1){		//出界，完成队列中剩下的坐标的路径绘制	
					canvas_paint.draw_line(coor_queue);	
				}
				coor_queue = [];
				canvas_paint.reset_last_coor();	//重置最后坐标为空
				if (!start_painting){
					start_painting = true;		//重置开始绘画标记
					//发送结束绘图提示
					socket.emit('finish painting', {
						roomId: roomId,
						userId: userId
					});
					//在成员列表中，添加正在绘图标示
					var $li = $('.left .members li[data-user_id="' + userId + '"]')
					$li.find('img')
					.attr('src', 'image/green.jpg')
					.removeClass('writing');
				}
			})
			.on('mouseup', function(event){
				$(this).unbind('mousemove');	//同上
				if (coor_queue.length > 1){
					canvas_paint.draw_line(coor_queue);	
				}
				coor_queue = [];
				canvas_paint.reset_last_coor();
				if (!start_painting){
					start_painting = true;		//重置开始绘画标记
					//发送结束绘图提示
					socket.emit('finish painting', {
						roomId: roomId,
						userId: userId
					});
					//在成员列表中，添加正在绘图标示
					var $li = $('.left .members li[data-user_id="' + userId + '"]')
					$li.find('img')
					.attr('src', 'image/green.jpg')
					.removeClass('writing');
				}
			});
		},
		// coor_queue: function(){
		// 	return coor_queue;
		// }
	}
});