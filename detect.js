var noble = require('noble');
var request = require('request');

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
		dict[peripheral.uuid] = {'list': [peripheral.rssi], 'average':peripheral.rssi, 'count':1};
	}
	console.log('Discovered Peripheral : ' + peripheral.uuid + 'Name : ' + peripheral.advertisement.localname + ' RSSI:' + peripheral.rssi + 'count:' + dict[peripheral.uuid].count);

	if (is_done() == true){
		console.log(dict);
		noble.stopScanning();
		/* send to server */
	}
});