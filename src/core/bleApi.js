import { ipcMain } from 'electron';
import PuckJs from '../../lib/puckJs.js';
import { app } from 'electron';

const puckJs = new PuckJs();

const _init = (webContents) => {


  puckJs.on('discover', function(peripherical) {
    console.log('new device ....>', peripherical);
    webContents.send('new-device', peripherical);
  });

  puckJs.on('btn-pressed', function(peripherical) {
    console.log('BTN pressed');
    webContents.send('btn-pressed');
  });


  // command from renderer process
  ipcMain.on('start-scan', function(event) {
    puckJs.startScan();
    event.returnValue = true;
  });

  ipcMain.on('stop-scan', function(event) {
    puckJs.stopScan();
    event.returnValue = true;
  });

  ipcMain.on('connect', function(event, deviceUuid) {
    console.log(`Connecting to: ${deviceUuid}`);
    puckJs.connect(deviceUuid).then(() => event.sender.send(`${deviceUuid}-connection`, true))
    .catch((error) => event.sender.send(`${deviceUuid}-connection`, error));
  });

  ipcMain.on('set-led-color', (event, colors) => {
    puckJs.setLedColor(colors).then(() => event.sender.send('set-led-color-reply', true))
    .catch((error) => event.sender.send('set-led-color-reply', error));
  });
}

export default (webContents) => {
  // wait for the view to be ready
  webContents.on('did-finish-load', _init.bind(null, webContents));
}

app.on('will-quit', () => {
  puckJs.disconnect();
});