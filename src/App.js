import React, { Component } from 'react';
import './App.css';

import Watermelons from './components/Watermelon';

class App extends Component {
  componentWillMount() {
    this.updateDimensions();
  }

  // componentDidMount() {
  //   window.addEventListener('resize', this.updateDimensions.bind(this));
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions.bind(this));
  // }

  updateDimensions() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.setState({
      width: width < height ? width : height,
      height: width < height ? width : height
    });
  }

  render() {
    const {
      width, height
    } = this.state;
    // const width = 4000;
    // const height = 4000;

    return (
      <div className="App">
        <Watermelons
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default App;
