const noble = require('noble');

const serviceUuid = 'abcd';
const characteristicUuid = 'bcde';
const characteristic2Uuid = 'bcdf';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log('start scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log('Found device with local name: ' + peripheral.advertisement.localName);
  console.log('advertising the following service uuid\'s: ', peripheral);
  noble.stopScanning();
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid, error);
    peripheral.discoverServices([serviceUuid], function(error, services) {
      console.log('discovered the following services:');
      for (var i in services) {
        console.log('  ' + i + ' uuid: ' + services[i].uuid);
      }
      const service = services[0];
      service.discoverCharacteristics([characteristicUuid, characteristic2Uuid], function(error, characteristics) {
        const ledChar = characteristics[0];
        const btnChar = characteristics[1];
        const command = Buffer.from([0]);
        ledChar.write(command, true, function(error) {
          if(error) {
            console.error('An error occured', error);
          }
          else {
            console.log('All done !!!!');
            // peripheral.disconnect();
            // process.exit(0);
          }
        });
        btnChar.on('data', function(data, isNotification) {
          console.log('Button has been pressed !!!');
        });
        btnChar.subscribe(function(error) {
          if(error)
            console.log('Error on subscribe');
        });
      });
    });
  });
});