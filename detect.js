var noble = require('noble');
var request = require('request');

request('http://blepark.azurewebsites.net/chat', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
  }
})

request.post(
    'http://blepark.azurewebsites.net/chat',
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);

var dict = {};

noble.on('stateChange', function(state) {
	if (state === 'poweredOn' ) {
		noble.startScanning([],true);
		console.log('Started Scanning');
	} else {
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral) {
console.log('Discovered Peripheral : ' + peripheral.uuid + ' RSSI:' + peripheral.rssi);

if (peripheral.uuid in dict){
	dict[peripheral.uuid].count = dict[peripheral.uuid].count + 1;
	dict[peripheral.uuid].average = (dict[peripheral.uuid].average*(dict[peripheral.uuid].count-1) + peripheral.rssi)/dict[peripheral.uuid].count;
}
else {
	dict[peripheral.uuid] = {'average':peripheral.rssi, 'count':1};
}
console.log(dict)
/*peripheral.connect(function(error){
	if (error == undefined ){
		console.log(peripheral.uuid + ' RSSI:' + peripheral.rssi );
	} else {
		console.log(peripheral.uuid + ' RSSI:' + peripheral.rssi + ' Connecting, Error : ' + error); 
	}
}); */
/*peripheral.updateRssi(function(error, rssi){
console.log(peripheral.uuid + ' RSSI:' + peripheral.rssi+ ' update RSSI + ' + rssi + ' : Error :' + error);
});*/

/*peripheral.on('connect',function(){
	console.log(peripheral.uuid + ' RSSI:' + peripheral.rssi+ ' Has conected');
}); */
/*peripheral.on('rssiUpdate',function(rssi){
console.log(peripheral.uuid + ' RSSI updated : ' + rssi);

});
*/
});