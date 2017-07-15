const noble = require('noble');
const EventEmitter = require('events');

const serviceUuid = 'abcd';
const characteristicUuid = 'bcde';
const characteristic2Uuid = 'bcdf';

export default class PuckJs extends EventEmitter {
  constructor() {
    super();
    this._scanning = false;
    noble.on('discover', (peripheral) => {
      this.emit('discover', peripheral);
    });
  }

  startScan() {
    if(this._scanning) throw new Error('Scan is already activated');
    this._scanning = true;
    console.log(noble.state);
    if(noble.state === 'poweredOn') {
      console.log('start scanning');
      noble.startScanning();
    }
    else {
      noble.on('stateChange', function(state) {
        console.log(state);
        if (state === 'poweredOn') {
          console.log('start scanning');
          noble.startScanning();
        }
      });
    }
  }

  stopScan() {
    if(!this._scanning) throw new Error('Scan is already deactivated');
    this._scanning = false;
    noble.stopScanning();
  }

  getScanState() {
    return this._scanning;
  }
}

// noble.on('stateChange', function(state) {
//   if (state === 'poweredOn') {
//     console.log('start scanning');
//     noble.startScanning();
//   } else {
//     noble.stopScanning();
//   }
// });

// noble.on('discover', function(peripheral) {
//   console.log('Found device with local name: ' + peripheral.advertisement.localName);
//   console.log('advertising the following service uuid\'s: ', peripheral);
//   noble.stopScanning();
//   peripheral.connect(function(error) {
//     console.log('connected to peripheral: ' + peripheral.uuid, error);
//     peripheral.discoverServices([serviceUuid], function(error, services) {
//       console.log('discovered the following services:');
//       for (var i in services) {
//         console.log('  ' + i + ' uuid: ' + services[i].uuid);
//       }
//       const service = services[0];
//       service.discoverCharacteristics([characteristicUuid, characteristic2Uuid], function(error, characteristics) {
//         const ledChar = characteristics[0];
//         const btnChar = characteristics[1];
//         const command = Buffer.from([0]);
//         ledChar.write(command, true, function(error) {
//           if(error) {
//             console.error('An error occured', error);
//           }
//           else {
//             console.log('All done !!!!');
//             // peripheral.disconnect();
//             // process.exit(0);
//           }
//         });
//         btnChar.on('data', function(data, isNotification) {
//           console.log('Button has been pressed !!!');
//         });
//         btnChar.subscribe(function(error) {
//           if(error)
//             console.log('Error on subscribe');
//         });
//       });
//     });
//   });
// });