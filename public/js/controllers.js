'use strict';

/* Controllers */
angular.module('App.controllers', [])
	.controller('homeController', function ($scope, socket) {
		// socket.on('init', function (data) {
		// 	$scope.name = data.name;
		// 	$scope.users = data.users;
		// });
		socket.on('send:newcode', function (data) {
			console.log(data);
		});

		//new code
		$scope.newcode = createCode();
		socket.emit('send:newcode', {
			newCode: $scope.newcode
		});
	})
	.controller('playController', function ($scope, socket) {
		$scope.master = {};

		$scope.sendCode = function(user) {
			$scope.master = angular.copy(user);
			if ($scope.master !== undefined) {
				console.log($scope.master.code);

				socket.emit('send:usecode', {
					codeToUse: $scope.master.code
				});
				
			};
		};

		socket.on('init', function (data) {
			
		});
	});

	var createCode  = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};