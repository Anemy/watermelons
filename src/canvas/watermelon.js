const glitch = require('glitch-canvas');
const MersenneTwister = require('mersennetwister');

const maxRectangles = 20;
const maxText = 100;

const watermelonImages = [
  'eighth-bite.png',
  'eighth.png',
  'full.png',
  'half.png',
  'quarter-bite.png',
  'quarter-empty.png',
  'quarter.png'
];
export { watermelonImages };

function getRandomGlitchParams(seeder) {
  return {
    seed:       Math.floor(seeder.rnd() * 40), // Integer between 0 and 99.
    quality:    99, // Math.floor(seeder.rnd() * 40), // Integer between 0 and 99.
    amount:     Math.floor(seeder.rnd() * 20), // Integer between 0 and 99.
    iterations: Math.floor(seeder.rnd() * 10)  // Integer.
  };
}

export default class Glitch {
  constructor() {
    this.baseStyle = 'rgb(255, 0, 255)';
    this.backgroundStyle = 'rgb(255, 255, 255)';
  }

  async glitch(ctx, config, width, height) {
    ctx.clearRect(0, 0, width, height);

    const seeder = new MersenneTwister(config.Seed);

    if (config.Glitch) {
      // With glitch we apply a background.
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, width, height);
    }

    // 1. Add the text.
    // this.textLayer(ctx, config, seeder, width, height);

    // 2. Fill in random rectangles.
    // this.rectangleLayer(ctx, config, seeder, width, height);

    // 3. Decolorize certain areas and glitch them.

    this.drawWatermelons(ctx, config, seeder, width, height);

    // 4. Some rgb split.
    if (config.Glitch) {
      await this.glitchCanvas(ctx, seeder, width, height);
    }
  }

  drawWatermelons(ctx, config, seeder, width, height) {
    const {
      Watermelons,
      Circular
    } = config;

    const minSize = config['Min Size'];
    const maxSize = config['Max Size'];
    const minRotation = config['Min Rotation °'];
    const maxRotation = config['Max Rotation °'];

    console.log('width, height', width, height);
    console.log('Rendering', Watermelons, 'watermelons.');
    // console.log('circular', circular);

    for (let i = 0; i < Watermelons; i++) {
      const image = watermelonImages[Math.floor(seeder.rnd() * watermelonImages.length)];
      const imageDom = document.getElementById(image);

      const aspect = imageDom.width / imageDom.height;
      const displaySize = (seeder.rnd() * (maxSize - minSize)) + minSize;

      // if (seeder.rnd() > 0.95) {
      //   displaySize = seeder.rnd() * 300;
      // }
      // ctx.restore();
      // ctx.re();
      const imageWidth = displaySize;
      const imageHeight = displaySize / aspect;
      let imageX = Math.floor(seeder.rnd() * (width - (displaySize * 2))) + displaySize;
      let imageY = Math.floor(seeder.rnd() * (height - (displaySize * 2))) + displaySize;

      if (Circular) {
        // const randomX = seeder.rnd() * (width / 2) - (displaySize * 2);
        const velocity = seeder.rnd() * (Math.min(width, height) / 2);
        const direction = seeder.rnd() * Math.PI * 2;
        const xRandom = Math.cos(direction) * velocity;
        const yRandom = Math.sin(direction) * velocity;
        imageX = Math.floor(width / 2 + xRandom);
        imageY = Math.floor(height / 2 + yRandom);
      }

      // console.log('render image', imageDom.width, imageDom.height, imageDom.width / imageDom.height, imageX, imageY, displaySize, displaySize / aspect);

      const rotation = ((seeder.rnd() * (maxRotation - minRotation)) + minRotation) * (Math.PI / 180);

      ctx.save();
      // if (seeder.rnd() > 0.8) {
      //   ctx.globalCompositeOperation = 'darken';
      // }
      ctx.translate(imageX, imageY);
      ctx.rotate(rotation, imageX, imageY);
      ctx.drawImage(imageDom, 0, 0, imageWidth, imageHeight);
      ctx.restore();
    }
  }

  async glitchCanvas(ctx, seeder, width, height) {
    const glitchParams = getRandomGlitchParams(seeder);

    const glitchImageData = await glitch(glitchParams)
      .fromImageData(ctx.getImageData(0, 0, width, height))
      .toImageData();

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(glitchImageData, 0, 0);
  }

  rectangleLayer(ctx, config, seeder, width, height) {
    const rectangles = Math.floor(seeder.rnd() * maxRectangles);

    const maxRectangleWidth = width * (1 / 10);
    const maxRectangleHeight = height * (1 / 10);

    ctx.fillStyle = this.baseStyle;
    ctx.strokeStyle = this.baseStyle;

    for (let i = 0; i < rectangles; i++) {
      ctx.strokeRect(Math.floor(seeder.rnd() * width), Math.floor(seeder.rnd() * height), Math.floor(seeder.rnd() * maxRectangleWidth), Math.floor(seeder.rnd() * maxRectangleHeight));
      ctx.fillRect(Math.floor(seeder.rnd() * width), Math.floor(seeder.rnd() * height), Math.floor(seeder.rnd() * maxRectangleWidth), Math.floor(seeder.rnd() * maxRectangleHeight));
    }
  }

  textLayer(ctx, config, seeder, width, height) {
    const {
      text
    } = config;

    const maxFontSize = Math.floor(width * (1 / 10));
    const textCount = Math.floor(seeder.rnd() * maxText);

    for (let i = 0; i < textCount; i++) {
      ctx.save();
      const x = Math.floor(seeder.rnd() * width);
      const y = Math.floor(seeder.rnd() * height);
      ctx.rotate(seeder.rnd() * Math.PI * 2, x, y);

      ctx.font = `${Math.floor(seeder.rnd() * maxFontSize)}px Arial`;

      const randomTextSubstring = text.substring(Math.floor(seeder.rnd() * (text.length + 1)), Math.floor(seeder.rnd() * (text.length + 1)));

      ctx.fillText(randomTextSubstring, x,y);
      ctx.restore();
    }
  }

  // update(ctx) {
  //   // ctx.fillRect(20 + Math.floor(seeder.rnd() * 100), 20, 20, 20);
  // }
}