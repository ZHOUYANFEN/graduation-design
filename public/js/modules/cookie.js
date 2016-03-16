define(['config', 'jquery'], function(config, $){
	return {
		checkCookieEnable : function(){
			if(!(document.cookie || navigator.cookieEnabled)){
				return false;
			}
			return true;
		},
		setCookie : function(name, value){
			var exp = new Date(); 
			exp.setTime(exp.getTime() + config['cookieExpires']);		//config文件配置失效时间
			document.cookie = name + "="+ escape(value) + ";expires=" + exp.toUTCString(); 
		},
		getCookie : function(c_name){
			if (document.cookie.length > 0){
			  	c_start = document.cookie.indexOf(c_name + "=");
			  	if (c_start != -1){ 
				    c_start = c_start + c_name.length + 1 ;
				    c_end = document.cookie.indexOf(";", c_start);
				    if (c_end ==-1){
				    	c_end = document.cookie.length;
				    }
				    return unescape(document.cookie.substring(c_start, c_end));
			    } 
			}
			return "";
		},
		clearAll: function(){
			var exp = new Date();
			exp.setTime (exp.getTime() - 1000);

			var strCookie = document.cookie;
			var arrCookie = strCookie.split("; "); // 将多cookie切割为多个名/值对

			for(var i = 0; i < arrCookie.length; i++){ // 遍历cookie数组，处理每个cookie对
				var arr = arrCookie[i].split("=");
				if(arr.length > 0){
					document.cookie = arr[0] + "=" + escape('delete') + "; expires="+ exp.toGMTString();	
				}
			}
		}
	};
});


