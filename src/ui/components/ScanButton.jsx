import { remote, ipcRenderer } from 'electron';
import React from 'react';

export default class ScanButton extends React.Component {
  constructor(props) {
  	super(props);
    this.state = { scan : false };

  	this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ scan : !this.state.scan } );
    const actionName = !this.state.scan ? 'start-scan' : 'stop-scan';
    let res = ipcRenderer.sendSync(actionName);
  }	
  render() {
    return (
      <button id="scanButton" onClick={this.handleClick}>{ this.state.scan ? "Stop" : "Scan" }
      </button>
    );
  }
}