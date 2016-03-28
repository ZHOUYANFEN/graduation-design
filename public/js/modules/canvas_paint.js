define(['jquery', 'config'], function($, config){
	var	canvas,
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
		eraser = false,				//是否为橡皮擦
		eraser_size = 5,
		last_coor = 'none';		//默认最后坐标为空，坐标格式{x:x, y:y}

	return {
		init: function(){	//初始化，绑定各种事件
			canvas = document.querySelector('#main-canvas');
			context = canvas.getContext('2d');

			canvas.width = $('#main-content .center').width();	//canvas的宽高填充整个区域
			canvas.height = $('#main-content .center').height();
			
			context.fillStyle = color_arr['white'];		//以白色填充画布
			context.fillRect(0, 0, canvas.width, canvas.height);


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
					eraser_size = 15;
				}else{
					eraser_size = 30;
				}
			});
		},
		palette: function(){	//返回画板中画笔信息
			return {
				eraser: eraser,
				eraser_size: eraser_size,
				color: color,
				lineWidth: lineWidth,
				last_coor: last_coor
			}
		},
		draw_line: function(){	//绘制线条/橡皮擦擦除
			var coor_queue = arguments[0];	//路径坐标队列

			if (arguments.length == 1){		//本地的绘制
				if (!eraser){	//普通路径
					context.strokeStyle = color;
					context.lineWidth = lineWidth; 
					context.beginPath();	//开始绘制
					
					if (last_coor == 'none'){	//路径的第一个坐标
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
				}else{		//橡皮擦
					context.fillStyle = color_arr['white'];

					for (var i = 0; i < coor_queue.length; i++) {
						context.beginPath();
						context.arc(coor_queue[i].x, coor_queue[i].y, eraser_size, 0, 2*Math.PI);
						context.fill();
					}
				}
			}else{	//socket接收其它成员绘画信息
				var palette = arguments[1];		//使用socket中的画笔配置

				if (!palette.eraser){	//普通路径
					context.strokeStyle = palette.color;
					context.lineWidth = palette.lineWidth; 
					context.beginPath();	//开始绘制
					
					if (palette.last_coor == 'none'){	//路径的第一个坐标
						context.moveTo(coor_queue[0].x, coor_queue[0].y);
					}
					else{
						context.moveTo(palette.last_coor.x, palette.last_coor.y);
						context.lineTo(coor_queue[0].x, coor_queue[0].y);
					}

					for (var i = 1; i < coor_queue.length; i++) {
						context.lineTo(coor_queue[i].x, coor_queue[i].y);
					}

					context.stroke();
				}else{		//橡皮擦
					context.fillStyle = color_arr['white'];

					for (var i = 0; i < coor_queue.length; i++) {
						context.beginPath();
						context.arc(coor_queue[i].x, coor_queue[i].y, palette.eraser_size, 0, 2*Math.PI);
						context.fill();
					}
				}
			}
		},
		reset_last_coor: function(){	//结束一条线条的绘制后，需要重置坐标坐标为空
			last_coor = 'none';
		}
	}	
});