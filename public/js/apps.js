'use strict';
//App
angular.module('App', [
	'ngRoute',
	'App.controllers',
	'App.services',
	'btford.socket-io'
], function() {
	// $interpolateProvider.startSymbol('<%');
	// $interpolateProvider.endSymbol('%>');
})

.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: '/html/home.html',
				controller: 'homeController'
			}).
			when('/play', {
				templateUrl: '/html/play.html',
				controller: 'playController'
			}).
			otherwise({
				redirectTo: '/home'
			});
}])
