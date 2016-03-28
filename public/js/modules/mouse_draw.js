define(['jquery', 'canvas_paint', 'socket', 'config'], function($, canvas_paint, socket_module, config){
	var socket = socket_module.socket_object(),		//socket.io中的socket句柄
		roomId = window.location.href.split(/roomId=/)[1];

	var coor_queue = [],	//鼠标移动路径的坐标队列
		num_to_draw = 5;	//坐标够多少个后开始绘制

	return {
		init: function(){
			//主画布上的mouse事件
			$('#main-content .center').on('mousedown', function(event1){
				var offsetLeft = $(this).offset().left,
					offsetTop = $(this).offset().top;
				var count = 0;

				$(this).on('mousemove', function(event2){	//记录鼠标移动轨迹
					var coor = {
						x: event2.pageX - offsetLeft,
						y: event2.pageY - offsetTop
					}
					coor_queue.push(coor);	//将坐标塞入队列
					count ++;

					if (count >= num_to_draw){	
						//socket发送画笔信息 + 坐标队列
						var palette = canvas_paint.palette();	//实时画笔配置
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
			})
			.on('mouseup', function(event){
				$(this).unbind('mousemove');	//同上
				if (coor_queue.length > 1){
					canvas_paint.draw_line(coor_queue);	
				}
				coor_queue = [];
				canvas_paint.reset_last_coor();
			});
		},
		// coor_queue: function(){
		// 	return coor_queue;
		// }
	}
});