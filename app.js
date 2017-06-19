var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('btnClicked', function () {
    console.log("Button get location clicked!");
    makeLocationRequest();
  });
});

function makeLocationRequest() {
  request('http://ip-api.com/json/?fields=8405', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // print location to console
      var locationData = body
      io.emit('locationEvent', locationData);
    }
  });
}

app.post('/location', function(req, res) {
  locationData = req.body
  io.emit('locationEvent', locationData); 
});

server.listen(3000, function () {
  var port = server.address().port
  console.log('Server listening on mylinkit.local:%s...', port);
});
