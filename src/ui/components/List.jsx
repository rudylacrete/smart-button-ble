import { remote, ipcRenderer } from 'electron';
import React from 'react';

import puckJs from '../../../lib/puckJs.js';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      devices : []
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.isScanning != nextProps.isScanning && nextProps.isScanning == true) {
      this.setState({devices : []});
    }
  }
  componentDidMount() {
    puckJs.on('discover', (device) => {
      console.log(device);
      this.setState({ devices : [...this.state.devices, device ]});
    });
    puckJs.on('btn-pressed', () => {
      console.log("Button pressed");
    });
  }
  connectDevice(deviceUuid) {
    puckJs.connect(deviceUuid).then(() => {
      // ipcRenderer.send('set-led-color', {blue: true});
      alert('connect OK');
    }).catch(() => alert('connect failed'));
  }
  render() {
    let devices = this.state.devices; 
    return (
      devices && 
      <ul>
        { devices.map((device) => {
          return <li key= { device.uuid }>{ device.advertisement.localName } <button onClick={() => this.connectDevice(device.uuid)}>Connect</button></li>
        })}
      </ul>
    );
  }
}