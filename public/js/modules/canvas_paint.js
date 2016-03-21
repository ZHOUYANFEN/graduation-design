define(['jquery', 'config'], function($, config){
	var canvas,
		context,
		color_arr = {
			black: '#000000',
			red: '#ff0000',
			blue: '#0000ff',
			green: '#00ff00',
			yellow: '#ffff00',
			purple: '#ff00ff',
			orange: '#ff9900',
			white: '#ffffff'
		},
		color = color_arr['black'],		//默认颜色
		lineWidth = 2,					//默认线条粗细
		eraser = false,
		eraser_size = 5,
		last_coor = 'none';		//默认最后坐标为空，坐标格式{x:x, y:y}

	return {
		init: function(){
			canvas = document.querySelector('#main-canvas');
			context = canvas.getContext('2d');

			//canvas的宽高填充整个区域
			canvas.width = $('#main-content .center').width();
			canvas.height = $('#main-content .center').height()
			//窗口大小调整时，重定义canvas宽高
			// $(window).on('resize', function(event){
			// 	canvas.width = $('#main-content .center').width();
			// 	canvas.height = $('#main-content .center').height();
			// });

			//绑定事件，调色板中颜色更换
			$('#main-content .palette .colors').on('click', 'td', function(event){
				//更新当前颜色，去除橡皮擦
				var color_name = $(this).attr('class');
				$('#main-content .palette .current-color div').attr('class', color_name);
				$('#main-content .palette .current-color div').html('');
				$('#main-content .palette .eraser .options div').removeClass('active');
				//更新全局color, eraser变量
				color = color_arr[color_name];
				eraser = false;
			});

			//线条粗细变更
			$('#main-content .palette .line-weight .options').on('click', 'div', function(event){
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				if ($(this).hasClass('light')){
					lineWidth = 2;
				}
				else if ($(this).hasClass('medium')){
					lineWidth = 4;
				}
				else{
					lineWidth = 8;
				}
			});

			//橡皮擦
			$('#main-content .palette .eraser .options').on('click', 'div', function(event){
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				$('#main-content .palette .current-color div').attr('class', 'white');
				$('#main-content .palette .current-color div').html('<p>橡皮擦</p>');

				eraser = true;
				if ($(this).hasClass('small')){
					eraser_size = 7;
				}else if ($(this).hasClass('medium')){
					eraser_size = 14;
				}else{
					eraser_size = 21;
				}
			});

		},
		line_style: function(){
			return {
				color: color,
				lineWidth: lineWidth
			}
		},
		draw_line: function(coor_queue){
			if (!eraser){
				context.strokeStyle = color;		//全局颜色变量
				context.lineWidth = lineWidth;		//全局线条粗细 

				//开始绘制
				context.beginPath();
				//路径的第一个坐标
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
			}else{
				context.fillStyle = color_arr['white'];

				for (var i = 0; i < coor_queue.length; i++) {
					context.beginPath();
					context.arc(coor_queue[i].x, coor_queue[i].y, eraser_size, 0, 2*Math.PI);
					context.fill();
				}
			}
		},
		//结束一条线条的绘制后，需要重置坐标坐标为空
		reset_last_coor: function(){	
			last_coor = 'none';
		}
	}	
});