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
  }
  connectDevice(deviceUuid) {
  	ipcRenderer.once(deviceUuid.'connect');
  	ipcRenderer.sendSync('connect');
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