var bleno = require('bleno');              
var keypress = require('keypress');                             

/*
up = 1
down = 2
left = 3
right = 4
 */

var key_val = "1";


console.log('bleno - iBeacon');              
                                             
bleno.on('stateChange', function(state) {    
  console.log('on -> stateChange: ' + state);
                                       
  if (state === 'poweredOn') {                                                                               
    bleno.startAdvertising('Car02', [key_val+'0000000000000000000000000000000']);
                                         
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




// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.end();
  }
  if (key.name == 'up'){
    key_val = "1";
    bleno.stopAdvertising();                                  
    bleno.startAdvertising('Car02', [key_val+'0000000000000000000000000000000']);
  }
  if (key.name == 'down'){
    key_val = "2";
    bleno.stopAdvertising();                                  
    bleno.startAdvertising('Car02', [key_val+'0000000000000000000000000000000']);
  }
  if (key.name == 'left'){
    key_val = "3";
    bleno.stopAdvertising();                                  
    bleno.startAdvertising('Car02', [key_val+'0000000000000000000000000000000']);
  }
  if (key.name == 'right'){
    key_val = "4";
    bleno.stopAdvertising();                                  
    bleno.startAdvertising('Car02', [key_val+'0000000000000000000000000000000']);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();