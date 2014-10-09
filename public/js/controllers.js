'use strict';

/* Controllers */
angular.module('App.controllers', [])
	//Home Controller
	.controller('homeController', [
		'$scope',
		'$timeout',
		'$location',
		'$window',
		'socket',
		function($scope, $timeout, $location, $window, socket) {

			$scope.counter = 3;
			var stopped;
			//Listener new code
			socket.on('send:newcode', function (data) {
				$scope.showCode = true;
				$scope.newcode = data.code;
			});

			//Listener paired devices
			socket.on('send:pairedComplete', function (data) {
				if (data.complete === true) {
					$scope.showButton = true;
					$scope.showCode = false;
					$scope.showIntro = true;
					$scope.counter = 3;
					$scope.countdown();
				};
			});

			//Event create new code
			$scope.getCode = function(){
				socket.emit('send:newcode');
			}

			//Countdown
			$scope.countdown = function() {
				stopped = $timeout(function() {
					$scope.counter--;
					if ($scope.counter === 0) {
						$timeout.cancel(stopped);
						$scope.showPlayElement = true;
					} else {
						$scope.countdown();
					};
					
				}, 1000);
			};

			socket.on('send:moveElementTo', function (data) {
				jQuery('.element').css('left', data.pixels + 'px');
			});

		}
	])
	//Play Controller
	.controller('playController', [
		'$scope',
		'$timeout',
		'$location',
		'$window',
		'socket',
		function($scope, $timeout, $location, $window, socket) {
			$scope.master = {};
			$scope.pixels = 5;

			//Event to pair device
			$scope.sendCode = function(user) {
				$scope.master = angular.copy(user);
				if ($scope.master !== undefined) {
					$scope.pixels = 5;
					socket.emit('send:usecode', {
						codeToUse: $scope.master.code
					});

				};
			};

			$scope.moveElement = function(){
				$scope.pixels += 5;
				socket.emit('send:moveElementFrom', {
					codeToUse: $scope.master.code,
					pixels: $scope.pixels
				});
			};

			//Listener error code
			socket.on('send:failpaired', function (data) {
				if (data.error === true) {
					$scope.message = 'Código mal ingresado';
					$timeout(function(){
						$scope.showMessage = false;
						$timeout(function(){
							$scope.showMessage = true;
						}, 1500);
					}, 500);
				};
			});


			// socket.on('init', function (data) {
				
			// });
		}
	]);