define(['jquery'], function($){
	var canvas,
		context,
		color_arr = {
			black: '#000',
			red: '#ff0000',
			bule: '#0000ff',
			green: '#00ff00'
		},
		color = color_arr.black,	//默认黑色
		last_coor = 'none';			//默认最后坐标为空，坐标格式{x:x, y:y}

	return {
		init: function(){
			canvas = document.querySelector('#main-canvas');
			//canvas的宽高填充整个区域
			canvas.width = $('#main-content .right').width();
			canvas.height = $('#main-content .right').height()
			context = canvas.getContext('2d');
			context.strokeStyle = color;	//全局颜色变量
		},
		draw_line: function(coor_queue){
			//开始绘制
			context.beginPath();

			if (last_coor == 'none'){
				context.moveTo(coor_queue[0].x, coor_queue[0].y);
			}
			else{
				context.moveTo(last_coor.x, last_coor.y);
				context.lineTo(coor_queue[0].x, coor_queue[0].y);
			}

			for (var i = 1; i < coor_queue.length; i++) {
				context.lineTo(coor_queue[i].x, coor_queue[i].y);
			}
			last_coor = {
				x: coor_queue[coor_queue.length-1].x,
				y: coor_queue[coor_queue.length-1].y,
			}

			context.stroke();
		},
		//结束一条线条的绘制后，需要重置坐标坐标为空
		reset_last_coor: function(){	
			last_coor = 'none'
		},
		change_color: function(new_color){

		}
	}	
});