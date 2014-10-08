var helpersApp = (function(){
	var socketCodes = {};

	var createCode  = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};

	var storeCode = function(code, id){
		socketCodes[code] = id;
	};

	var allCodes = function(){
		return socketCodes;
	};

	var searchCode = function(code){
		if(code in socketCodes) {
			return true;
		}
		return false;
	}

	var getIdSocket = function(code){
		return socketCodes[code];
	}

	return {
		createCode: createCode,
		storeCode: storeCode,
		allCodes: allCodes,
		searchCode: searchCode,
		getIdSocket: getIdSocket
	};
}());
// export function for listening to the socket
module.exports = function (socket) {
	// send the new user their name and a list of users
	socket.emit('init', {});
	//new code
	socket.on('send:newcode', function(){

		var newCode = helpersApp.createCode();
		//Store code
		helpersApp.storeCode(newCode, socket.id);
		socket.emit('send:newcode', {code: newCode});
		
	});

	socket.on('send:usecode', function(data){
		var idSocket = helpersApp.getIdSocket(data.codeToUse);
		socket.broadcast.to(idSocket).emit('send:pairedComplete', { complete: helpersApp.searchCode(data.codeToUse) });
	});
	// notify other clients that a new user has joined
	// socket.broadcast.emit('user:join', {
	//   name: name
	// });

	// // broadcast a user's message to other users
	// socket.on('send:message', function (data) {
	//   socket.broadcast.emit('send:message', {
	//     user: name,
	//     text: data.message
	//   });
	// });

	// // validate a user's name change, and broadcast it on success
	// socket.on('change:name', function (data, fn) {
	//   if (userNames.claim(data.name)) {
	//     var oldName = name;
	//     userNames.free(oldName);

	//     name = data.name;
			
	//     socket.broadcast.emit('change:name', {
	//       oldName: oldName,
	//       newName: name
	//     });

	//     fn(true);
	//   } else {
	//     fn(false);
	//   }
	// });

	// // clean up when a user leaves, and broadcast it to other users
	// socket.on('disconnect', function () {
	//   socket.broadcast.emit('user:left', {
	//     name: name
	//   });
	//   userNames.free(name);
	// });
};