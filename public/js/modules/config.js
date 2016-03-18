define(function(){
	return {
		host: 'localhost',
		cookieExpires: '24*60*60*1000',
		api: {
			user: {
				log: ['/api/user/log', 'POST'],
				reg: ['/api/user/reg', 'POST'],
				changePass: ['/api/user/changePass', 'POST'],
				update: ['/api/user/update', 'POST']
			}
		}
	}
});