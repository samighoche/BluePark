var bleno = require('./index');

console.log('bleno - iBeacon');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
  	var buffer = new Buffer("I'm a string!", "utf-8")
  	var scandata = new Buffer()
    bleno.startAdvertising(buffer,
	scandata)
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function() {
  console.log('on -> advertisingStart');
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});
