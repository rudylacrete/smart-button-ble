import { ipcMain } from 'electron';
import PuckJs from '../../lib/puckJs.js';

const _init = (webContents) => {

  const puckJs = new PuckJs();

  puckJs.on('discover', function(peripherical) {
    console.log('new device ....>', peripherical);
    webContents.send('new-device', peripherical);
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
}

export default (webContents) => {
  // wait for the view to be ready
  webContents.on('did-finish-load', _init.bind(null, webContents));
}