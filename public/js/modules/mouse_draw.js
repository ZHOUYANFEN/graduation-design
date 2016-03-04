define(['jquery', 'canvas_paint'], function($, canvas_paint){
	//鼠标移动路径的坐标队列
	var coor_queue = [];
	//坐标够多少个后开始绘制
	var num_to_draw = 5;

	return {
		init: function(){
			//主画布上的mouse事件
			$('#main-content .right').on('mousedown', function(event1){
				var offsetLeft = $(this).offset().left,
					offsetTop = $(this).offset().top;

				var count = 0;
				$(this).on('mousemove', function(event2){
					var coor = {
						x: event2.pageX - offsetLeft,
						y: event2.pageY - offsetTop
					}
					coor_queue.push(coor);
					count ++;

					//调用canva_paint开始绘制
					if (count >= num_to_draw){	
						canvas_paint.draw_line(coor_queue);	
						coor_queue = [];	//清空队列
						count = 0;
					}
				});
			})
			.on('mouseleave', function(event){
				$(this).unbind('mousemove');
				//出界，完成队列中剩下的坐标的路径绘制
				if (coor_queue.length > 1){		
					canvas_paint.draw_line(coor_queue);	
				}
				coor_queue = [];
				//重置最后坐标为空
				canvas_paint.reset_last_coor();
			})
			.on('mouseup', function(event){
				$(this).unbind('mousemove');
				//同上
				if (coor_queue.length > 1){
					canvas_paint.draw_line(coor_queue);	
				}
				coor_queue = [];
				canvas_paint.reset_last_coor();
			});
		},
		coor_queue: function(){
			return coor_queue;
		}
	}

});