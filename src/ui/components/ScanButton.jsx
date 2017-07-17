import { remote, ipcRenderer } from 'electron';
import React from 'react';
import List from './List.jsx';

import puckJs from '../../../lib/puckJs.js';

export default class ScanButton extends React.Component {
  constructor(props) {
  	super(props);
    this.state = { isScanning : false };

  	this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ isScanning : !this.state.isScanning } );
    if(!this.state.isScanning)
      puckJs.startScan();
    else {
      try {
        puckJs.stopScan();
      } catch(e) {
        console.log('scan was probably already deactivated');
      }
    }
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