var bleno = require('./index');              
                                             
                                             
console.log('bleno - iBeacon');              
                                             
bleno.on('stateChange', function(state) {    
  console.log('on -> stateChange: ' + state);
                                       
  if (state === 'poweredOn') {                                            
        var buffer = new Buffer(6);                                       
        buffer.write("Samig", "utf-8");                                   
        var scandata = new Buffer(6);                                     
        console.log(buffer);                                              
                                                                          
        var scandata = new Buffer(16)                                     
    bleno.startAdvertising('Samig', ['12100000000000000000000000000000']);
                                         
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