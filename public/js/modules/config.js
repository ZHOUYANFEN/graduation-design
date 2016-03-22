define(function(){
	return {
		host: 'localhost',
		cookieExpires: '24*60*60*1000',
		api: {
			user: {
				log: ['/api/user/log', 'POST'],
				reg: ['/api/user/reg', 'POST'],
				changePass: ['/api/user/changePass', 'POST'],
				update: ['/api/user/update', 'POST'],
			},
			room: {
				hasCreatedRoom: ['api/room/hasCreatedRoom', 'GET'],
				createRoom: ['api/room/createRoom', 'POST'],
				getRoomList: ['api/room/getRoomList', 'GET'],
				getRoomInfo: ['api/room/getRoomInfo', 'GET'],
			}
		}
	}
});