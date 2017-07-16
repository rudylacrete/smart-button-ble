import { remote, ipcRenderer } from 'electron';
import React from 'react';
import List from './List.jsx';

export default class ScanButton extends React.Component {
  constructor(props) {
  	super(props);
    this.state = { isScanning : false };

  	this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ isScanning : !this.state.isScanning } );
    const actionName = !this.state.isScanning ? 'start-scan' : 'stop-scan';
    let res = ipcRenderer.sendSync(actionName);
  }	
  render() {
    return (
      <div>
        <button id="scanButton" onClick={this.handleClick}>{ this.state.isScanning ? "Stop" : "Scan" }</button>
        <List isScanning={ this.state.isScanning } />
      </div>
    );
  }
}