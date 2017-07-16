const noble = require('noble');
const EventEmitter = require('events');

const SERVICE_UUID = 'abcd';
const LED_CHAR_UUID = 'bcde';
const BTN_CHAR_UUID = 'bcdf';

export default class PuckJs extends EventEmitter {

  constructor() {
    super();
    this._scanning = false;
    this._devices = {};
    this._connectedDevice = null;
    this._btnChar = null;
    this._ledChar = null;
    noble.on('discover', (peripheral) => {
      this._addDevice(peripheral);
      this.emit('discover', peripheral);
    });

  }

  _addDevice(device) {
    if(this._devices[device.uuid]) return;
    this._devices[device.uuid] = device;
  }

  startScan() {
    if(this._scanning) throw new Error('Scan is already activated');
    this._scanning = true;
    if(noble.state === 'poweredOn') {
      console.log('start scanning');
      noble.startScanning();
    }
    else {
      noble.on('stateChange', function(state) {
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

  connect(deviceUuid) {
    if(this._connectedDevice) return Promise.reject(new Error('already connected'));
    return this._connect(deviceUuid)
    .then(this._getService.bind(this))
    .then(this._getCharacteristics.bind(this));
  }

  setLedColor({red = false, green = false, blue = false}) {
    if(!this._ledChar) return Promise.reject(new Error('Not connected to any device'));
    let value = 0;
    if(red) value |= 1;
    if(green) value |= 1 << 1;
    if(blue) value |= 1 << 2;
    return new Promise((resolve, reject) => {
      this._ledChar.write(Buffer.from([value]), true, (error) => {
        if(error) return reject(error);
        resolve();
      });
    });
  }

  setBtnNotifier(callback) {
    if(!this._btnChar) return Promise.reject(new Error('Not connected to any device'));
    return new Promise((resolve, reject) => {
      this._btnChar.on('data', () => callback());
      this._btnChar.subscribe((error) => {
        if(error) return reject(error);
        resolve();
      });
    });
  }

  _connect(deviceUuid) {
    return new Promise((resolve, reject) => {
      // we need to stop the scan before connecting to a device to avoid error
      if(this._scanning) this.stopScan();
      if(!this._devices[deviceUuid])
        return reject(new Error('Unknonw device'));
      const device = this._devices[deviceUuid];
      device.connect((error) => {
        if(error) return reject(error);
        this._connectedDevice = device;
        resolve(device);
      });
    });
  }

  _getService(device) {
    return new Promise((resolve, reject) => {
      device.discoverServices([SERVICE_UUID], (error, services) => {
        if(error) return reject(error);
        if(services.length != 0) return reject(new Error('Unable to get smart btn service'));
        this._currentDeviceService = services[0];
        resolve(this._currentDeviceService);
      });
    });
  }

  _getCharacteristics(service) {
    return new Promise((resolve, reject) => {
      service.discoverCharacteristics([LED_CHAR_UUID, BTN_CHAR_UUID], (error, characteristics) => {
        if(error) return reject(error);
        if(characteristics.length != 2) return reject(new Error('Unable to get characteristics'));
        this._ledChar = characteristics[0];
        this._btnChar = characteristics[1];
        resolve(true);
      });
    });
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