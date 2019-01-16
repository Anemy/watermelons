// import _ from 'lodash';
import * as dat from 'dat.gui';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import GlitchCanvas, { watermelonImages } from '../canvas/watermelon';

// const updateFreq = 20; // 20 ms (1/50) s

// const textToRender = '딱다그르딱다르하다'; // 'Wearwiki';
const textToRender = '平仮名ひらがな';

function downloadImage(canvasRef) {
  if (!canvasRef) {
    alert('Please let the image build before downloading.');
  }

  const image = canvasRef.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  const link = document.createElement('a');
  link.download = 'watermelons.png';
  link.href = image;
  link.click();
}

const minAmountOfWatermelons = 5;
const maxAmountOfWatermelons = 5000;

const maxSeed = 10000;

const WatermelonConfig = function(props) {
  this.Watermelons = 400; // minAmountOfWatermelons + Math.floor(Math.random() * (maxAmountOfWatermelons - minAmountOfWatermelons));
  this['Max Size'] = Math.floor(props.width / 20);// Math.random() * (props.width / 20) + 3;
  this['Min Size'] = 3;
  this['Min Rotation °'] = 0;
  this['Max Rotation °'] = 360;
  this.text = textToRender;
  this['Download Image'] = function() {};
  this.Circular = false;
  this['Image Size px'] = 3000;
  this['Glitch'] = false;
  this['Seed'] = Math.floor(Math.random() * maxSeed);
};

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

  constructor(props) {
    super(props);

    const watermelons = new WatermelonConfig(props);
    const gui = new dat.GUI();

    const propertyUpdated = () => {
      // Fires on every change, drag, keypress, etc.
      if (this.imagesLoaded) {
        this.refreshGlitch(this.watermelons);
      }
    };

    gui.add(watermelons, 'Download Image').onFinishChange(async() => {
      const size = watermelons['Image Size px'];
      this.hiddenCanvasRef.width = size;
      this.hiddenCanvasRef.height = size;

      const ctx = this.hiddenCanvasRef.getContext('2d');
      const glitch = new GlitchCanvas();
      glitch.glitch(ctx, {
        ...this.watermelons,
        'Min Size': this.watermelons['Min Size'] * (size / this.props.width),
        'Max Size': this.watermelons['Max Size'] * (size / this.props.width)
      }, size, size);

      downloadImage(this.hiddenCanvasRef);
    });
    gui.add(watermelons, 'Watermelons', minAmountOfWatermelons, maxAmountOfWatermelons, 1).onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Max Size', 2, props.width / 4).onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Min Size', 1, props.width / 4).onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Min Rotation °', 0, 360).onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Max Rotation °', 0, 360).onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Circular').onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Glitch').onFinishChange(propertyUpdated);
    gui.add(watermelons, 'Seed', 0, maxSeed, 1).onFinishChange(propertyUpdated);

    const outputFolder = gui.addFolder('Output Options');
    outputFolder.add(watermelons, 'Image Size px', 500, 5000, 1).onFinishChange(propertyUpdated);

    this.gui = gui;
    this.watermelons = watermelons;
  }

  componentDidMount() {
    // setTimeout(() => this.refreshGlitch(), 100);
  }

  componentDidUpdate() {
    // this.refreshGlitch();
  }

  async refreshGlitch(config) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.ctx = this.canvasRef.getContext('2d');
    this.glitch = new GlitchCanvas();

    this.glitch.glitch(this.ctx, config, this.props.width, this.props.height);

    this.setState({
      rendered: true
    });

    // this.updateInterval = setInterval(() => {
    //   this.glitch.update(this.ctx);
    // }, updateFreq);
  }

  watermelonImageLoaded = () => {
    this.watermelonImagesLoaded++;

    if (this.watermelonImagesLoaded === watermelonImages.length) {
      console.log('Watermelons loaded. Rendering now...');

      this.imagesLoaded = true;
      this.refreshGlitch(this.watermelons);
      console.log('Rendered.');
    }
  }

  watermelonImagesLoaded = 0;

  imagesLoaded = false;
  canvasRef = null;
  hiddenCanvasRef = null;
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
        {/* <button type="button" onClick={() => downloadImage(this.canvasRef)}>Download</button> */}
        <canvas
          className="glitch-canvas"
          height={height}
          ref={ref => this.canvasRef = ref}
          width={width}
          style={{
            visibility: rendered ? 'visible' : 'hidden'
          }}
        />
        {watermelonImages.map(imageUrl => (
          <img
            id={imageUrl}
            key={imageUrl}
            onLoad={this.watermelonImageLoaded}
            src={`watermelon/${imageUrl}`}
            alt={imageUrl}
            className="watermelon-image"
          />
        ))}
        {<canvas
          className="glitch-canvas"
          ref={ref => this.hiddenCanvasRef = ref}
          style={{
            visibility: 'hidden'
          }}
        />}
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
