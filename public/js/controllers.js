'use strict';

/* Controllers */
angular.module('App.controllers', [])
	.controller('homeController', function ($scope, socket) {

		socket.on('send:newcode', function (data) {
			console.log(data);
			$scope.showCode = true;
			$scope.newcode = data.code;
		});

		socket.on('send:pairedComplete', function (data) {
			console.log(data);
		});

		//new code
		$scope.showCode = false;
		$scope.getCode = function(){
			socket.emit('send:newcode');
		}

	})
	.controller('playController', function ($scope, socket) {
		$scope.master = {};

		$scope.sendCode = function(user) {
			$scope.master = angular.copy(user);
			if ($scope.master !== undefined) {

				socket.emit('send:usecode', {
					codeToUse: $scope.master.code
				});

			};
		};

		// socket.on('init', function (data) {
			
		// });
	});

	var createCode  = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	};