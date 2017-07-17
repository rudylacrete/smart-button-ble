import React from 'react';

import puckJs from '../../../lib/puckJs.js';

export default class LedColor extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ledValue: 0
    }

    this.handleSetLedValue = this.handleSetLedValue.bind(this);
  }
  componentDidMount() {
    puckJs.on('btn-pressed', () => {
      this.btnElement.classList.add('pulse');
      setTimeout(() => {this.btnElement.classList.remove('pulse')}, 200);
    });
  }
  handleSetLedValue(e) {
    const value = +(e.target.value);
    if(isNaN(value)) return;
    const red = ((value >> 2) & 1) === 1;
    const green = ((value >> 1) & 1) === 1;
    const blue = ((value) & 1) === 1;
    puckJs.setLedColor({red, green, blue});
  }
  render() {
    return (
      <div>
        { this.props.connected &&
          <div className="round" ref={(element) => {this.btnElement = element;}}></div>
        }
        <div>{ this.props.connected ? 'connected' : 'disconnected' }</div>
        { this.props.connected && 
          <input type="text" value={this.state.value} onChange={this.handleSetLedValue}></input>
        }
      </div>
    );
  }
}