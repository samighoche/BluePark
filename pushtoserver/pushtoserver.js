// requires sudo npm install -g socket.io-client and sudo npm install socket.io-client
var io = require('socket.io-client'),

// connects to the cloud server controller
socket = io.connect('http://bleboys.cloudapp.net:8080');

// on successfull connection print this
socket.on('connect', function () { console.log("socket connected"); });

// this is pushing some data from this client to the server with event described by 'detect'
// data is JSON dict style
socket.emit('detect', { myuuid: 'datafrompush' });


 