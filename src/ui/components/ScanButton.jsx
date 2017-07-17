import React from 'react';
import List from './List.jsx';
import LedColor from './LedColor.jsx';

import puckJs from '../../../lib/puckJs.js';

export default class ScanButton extends React.Component {
  constructor(props) {
  	super(props);
    this.state = {
      isScanning : false,
      isConnected: false
    };

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
  setConnectedState(isConnected) {
    this.setState(Object.assign({}, this.state, {isConnected}));
  }
  render() {
    let setConnected = this.setConnectedState.bind(this);
    return (
      <div>
        <button id="scanButton" onClick={this.handleClick}>{ this.state.isScanning ? "Stop" : "Scan" }</button>
        <List isScanning={ this.state.isScanning } setConnected={setConnected} />
        <LedColor connected={ this.state.isConnected } />
      </div>
    );
  }
}