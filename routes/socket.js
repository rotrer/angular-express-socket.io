var helpersApp = (function(){
	var socketCodes = {};

	var createCode  = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for( var i=0; i < 2; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};

	var storeCode = function(code, socket){
		socketCodes[code] = socket;
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
		helpersApp.storeCode(newCode, socket);
		socket.emit('send:newcode', {code: newCode});
		
	});

	socket.on('send:usecode', function(data){
		var upperCode = data.codeToUse.toUpperCase();
		var targetSocket = helpersApp.getIdSocket(upperCode);
		if (targetSocket !== undefined) { 
			targetSocket.emit('send:pairedComplete', { complete: helpersApp.searchCode(upperCode) });
		} else {
			socket.emit('send:failpaired', {error: true});
		}
	});

	socket.on('send:moveElementFrom', function(data){
		var upperCode = data.codeToUse.toUpperCase();
		var targetSocket = helpersApp.getIdSocket(upperCode);
		if (targetSocket !== undefined) {
			targetSocket.emit('send:moveElementTo', { pixels: data.pixels });
		}
	});
};