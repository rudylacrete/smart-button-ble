import { remote, ipcRenderer } from 'electron';
import React from 'react';

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
    ipcRenderer.on('new-device', (event, device) => {
      this.setState({ devices : [...this.state.devices, device ]});
    });
    ipcRenderer.on('btn-pressed', () => {
      console.log("Button pressed");
    });
  }
  connectDevice(deviceUuid) {
    ipcRenderer.once(deviceUuid + '-connection', (event, res) => {
      // ipcRenderer.send('set-led-color', {blue: true});
      console.log("connect done", res);
    });
    ipcRenderer.send('connect', deviceUuid);
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