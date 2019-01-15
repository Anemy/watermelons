// import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import GlitchCanvas from '../canvas/watermelon';

// const updateFreq = 20; // 20 ms (1/50) s

// const textToRender = '딱다그르딱다르하다'; // 'Wearwiki';
const textToRender = '平仮名ひらがな';

function downloadImage(canvasRef){
  const image = canvasRef.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  const link = document.createElement('a');
  link.download = 'watermelons.png';
  link.href = image;
  link.click();
  // download.setAttribute('download','archive.png');
}

/**
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

//Create canvas with the device resolution.
var myCanvas = createHiDPICanvas(500, 250);

//Create canvas with a custom resolution.
var myCustomCanvas = createHiDPICanvas(500, 200, 4);

 */

class Watermelon extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = {
    height: 500,
    width: 500
  };

  state = {
    rendered: false
  };

  componentDidMount() {
    setTimeout(() => this.refreshGlitch(), 100);
    // ;
  }

  componentDidUpdate() {
    // this.refreshGlitch();
  }

  async refreshGlitch() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.ctx = this.canvasRef.getContext('2d');
    this.glitch = new GlitchCanvas();

    this.glitch.glitch(this.ctx, textToRender, this.props.width, this.props.height);

    this.setState({
      rendered: true
    });

    // this.updateInterval = setInterval(() => {
    //   this.glitch.update(this.ctx);
    // }, updateFreq);
  }

  canvasRef = null;
  ctx = null;
  glitch = null;
  svgContainerRef = null;

  render() {
    const {
      rendered
    } = this.state;

    const {
      width, height
    } = this.props;

    return (
      <React.Fragment>
        <button type="button" onClick={() => downloadImage(this.canvasRef)}>Download</button>
        <canvas
          className="glitch-canvas"
          height={height}
          ref={ref => this.canvasRef = ref}
          width={width}
          style={{
            visibility: rendered ? 'visible' : 'hidden'
          }}
        />
      </React.Fragment>

      // <svg
      //   className="dunes-svg"
      //   height={height - padding}
      //   ref={ref => this.svgContainerRef = ref}
      //   width={width - padding}
      // />
    );
  }
}

export default Watermelon;
