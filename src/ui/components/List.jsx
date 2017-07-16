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
  	if(this.props.isScanning != nextProps.isScanning) {
			this.setState({devices : []});
  	}
  }
  componentDidMount() {
  	ipcRenderer.on('new-device', (event, device) => {
      this.setState({ devices : [...this.state.devices, device ]});
		});
  }
  render() {
  	let devices = this.state.devices; 
  	return (
	  	devices && 
	  	<ul>
	  		{ devices.map((device) => {
	  			return <li key= { device.uuid }>{ device.advertisement.localName }</li>
	  		})}
	  	</ul>
  	);
  }
}