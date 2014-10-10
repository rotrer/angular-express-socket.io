var express = require('express'),
		http = require('http'),
		path = require('path'),
		socket = require('./routes/socket.js');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server, { log: false });

var publid_dir =  __dirname + '/public';

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use('/static',  express.static(__dirname + '/bower_components'));
	app.use(express.errorHandler());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get("/", function(request, response) {
  response.sendFile(publid_dir + "/index.html");
});

// Socket.io Communication
io.sockets.on('connection', socket);
