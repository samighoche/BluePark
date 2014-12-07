var noble = require('noble');
var request = require('request');
var beacon_name = "david's beacon"
var direction = "12100000000000000000000000000000"
var dict = {};
var k = 10;
noble.on('stateChange', function(state) {
	if (state === 'poweredOn' ) {
		noble.startScanning([],true);
		console.log('Started Scanning');
	} else {
		noble.stopScanning();
	}
});

function is_done() {
	for (uuid in dict) {
		if (dict[uuid].count < k) {
			return false;
		}
	}
	return true;
}

noble.on('discover', function(peripheral) {
	
	if (peripheral.uuid in dict){
		dict[peripheral.uuid].list.push(peripheral.rssi);
		dict[peripheral.uuid].count = dict[peripheral.uuid].count + 1;
		if (dict[peripheral.uuid].count > k) {
			dict[peripheral.uuid].average = (dict[peripheral.uuid].average*k - dict[peripheral.uuid].list[dict[peripheral.uuid].count-k-1] + peripheral.rssi)/k;
		}
		else {
			dict[peripheral.uuid].average = (dict[peripheral.uuid].average*(dict[peripheral.uuid].count-1) + peripheral.rssi)/dict[peripheral.uuid].count;					
		}
		
	}
	else {
		console.log()
		if (peripheral.advertisement.localName != undefined && peripheral.advertisement.serviceUuids[0] == direction) {
			dict[peripheral.uuid] = {'list': [peripheral.rssi], 'average':peripheral.rssi, 'count':1};	
		}
	}
	if (peripheral.advertisement.localName != undefined) {
		console.log('Discovered Peripheral : ' + peripheral.uuid + ', Name: ' + peripheral.advertisement.localName + ', Data: ' + peripheral.advertisement.serviceUuids + ', RSSI:' + peripheral.rssi + ', Count:' + dict[peripheral.uuid].count);
	}
	
	if (is_done() == true){
		console.log(dict);
		noble.stopScanning();
		// requires sudo npm install -g socket.io-client and sudo npm install socket.io-client
		var io = require('socket.io-client'),

		// connects to the cloud server controller
		socket = io.connect('http://bleboys.cloudapp.net:8080');

		// on successfull connection print this
		socket.on('connect', function () { console.log("socket connected"); });

		// this is pushing some data from this client to the server with event described by 'detect'
		// data is JSON dict style
		name = peripheral.advertisement.localName;
		socket.emit('detect', {'beacon': beacon_name, 'car name': name, 'average-rssi': dict[peripheral.uuid].average, 'direction': peripheral.advertisement.serviceUuids[0]});

	}
});