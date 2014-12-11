// libraries required
var noble = require('noble');
var request = require('request');

// beacon details and dictionary
var beacon_name = "1"
var directions = {
    "10000000000000000000000000000000": "up",
    "20000000000000000000000000000000": "down"
}
last_direction = {}
var dict = {};
// k corresponds to the number of detection scans to average before reporting to the controller
// a specific car's RSSI
var k = 10;

// requires sudo npm install -g socket.io-client and sudo npm install socket.io-client
var io = require('socket.io-client'),

    // connects to the cloud server controller
    socket = io.connect('http://bluepark.cloudapp.net:8080');

// on successfull connection print this
socket.on('connect', function() {
    console.log("socket connected");
});

// on bluetooth being powered on, start scanning
noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        // this will scan repeatidly for all devices [] - no specific UUID
        noble.startScanning([], true);
        console.log('Started Scanning');
    } else {
        // if bluetooth could not be activated, stop scan
        noble.stopScanning();
    }
});

// this function makes sure that the car has been detected "k" times before reporting its 
// average RSSI value - from our tests, 10 scans happen really quickly - so this smooths out 
// some of the noise and variance in the measurement
function is_done() {
    for (uuid in dict) {
        if (dict[uuid].count < k) {
            return false;
        }
    }
    return true;
}

// on discovering a peripheral device, i.e. a potential car, this event fires
noble.on('discover', function(peripheral) {
    // if the car is in our dictionary already, we update its RSSI and count k
    if (peripheral.uuid in dict) {
        dict[peripheral.uuid].list.push(peripheral.rssi);
        dict[peripheral.uuid].count = dict[peripheral.uuid].count + 1;
        if (dict[peripheral.uuid].count > k) {
            dict[peripheral.uuid].average = (dict[peripheral.uuid].average * k - dict[peripheral.uuid].list[dict[peripheral.uuid].count - k - 1] + peripheral.rssi) / k;
        } else {
            dict[peripheral.uuid].average = (dict[peripheral.uuid].average * (dict[peripheral.uuid].count - 1) + peripheral.rssi) / dict[peripheral.uuid].count;
        }

    }
    // if the car is not in our dictionary yet, and is one of our devices as determined by its name and services, then we 
    // add it to our dictionary
    else {
        if (peripheral.advertisement.localName != undefined && peripheral.advertisement.serviceUuids[0] in directions) {
            dict[peripheral.uuid] = {
                'list': [peripheral.rssi],
                'average': peripheral.rssi,
                'count': 1
            };
        }
    }
    // splicing for the correct service and direction for this beacon	
    if (peripheral.advertisement.localName != undefined && peripheral.advertisement.serviceUuids[0] in directions) {
        length = peripheral.advertisement.serviceUuids.length;
        for (i = 0; i < length - 1; i++) {
            peripheral.advertisement.serviceUuids.splice(i);
        }
    } else {
        if (peripheral.advertisement.localName != undefined) {
            peripheral.advertisement.serviceUuids.splice(0);
        }
    }
    // check if we have sufficient recordings of the device's RSSI, if so, forward this to the server with details,
    // via socket.io emit events
    if (is_done() == true && peripheral.advertisement.localName != undefined && peripheral.advertisement.serviceUuids[0] in directions) {

        // this is pushing some data from this client to the server with event described by 'detect'
        // data is JSON dict style
        name = peripheral.advertisement.localName;
        if (!(name in last_direction) || last_direction[name] != peripheral.advertisement.serviceUuids[0]) {
            emission = {
                'beacon': beacon_name,
                'car_name': name,
                'average_rssi': dict[peripheral.uuid].average,
                'direction': peripheral.advertisement.serviceUuids[0]
            }
            socket.emit('detect', emission);
            last_direction[name] = peripheral.advertisement.serviceUuids[0]
            console.log("emitted!", emission);

            dict = {}
        }

    }
});