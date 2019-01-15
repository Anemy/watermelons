const glitch = require('glitch-canvas');

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

for (let i = 0; i < watermelonImages.length; i++) {
  const x = document.createElement('IMG');
  x.setAttribute('src', `watermelon/${watermelonImages[i]}`);
  x.setAttribute('id', watermelonImages[i]);
  x.setAttribute('class', 'watermelon-image');
  // x.setAttribute('width', '304');
  // x.setAttribute('height', '228');
  x.setAttribute('alt', 'The Pulpit Rock');
  document.body.appendChild(x);
}


function getRandomGlitchParams() {
  return {
    seed:       Math.floor(Math.random() * 40), // Integer between 0 and 40.
    quality:    99, // Math.floor(Math.random() * 40), // Integer between 0 and 40.
    amount:     Math.floor(Math.random() * 20), // Integer between 0 and 40.
    iterations: Math.floor(Math.random() * 10)  // Integer.
  };
}

export default class Glitch {
  constructor() {
    this.baseStyle = 'rgb(255, 0, 255)';
    this.backgroundStyle = 'rgb(255, 255, 255)';
  }

  async glitch(ctx, text, width, height) {
    // 1. Add the text.
    // this.textLayer(ctx, text, width, height);

    // ctx.fillRect(20 + Math.floor(Math.random() * 100), 20, 20, 20);

    // 2. Fill in random rectangles.
    // this.rectangleLayer(ctx, width, height);

    // 3. Decolorize certain areas and glitch them.

    this.drawWatermelons(ctx, width, height);


    // 4. Some rgb split.
    // await this.glitchCanvas(ctx, width, height);
  }

  drawWatermelons(ctx, width, height) {
    const amountOfWatermelons = 400;

    console.log('width, height', width, height);
    let circular = false;
    if (Math.random() > 0.6) {
      circular = true;
    }
    console.log('circular', circular);

    for (let i = 0; i < amountOfWatermelons; i++) {
      const image = watermelonImages[Math.floor(Math.random() * watermelonImages.length)];
      const imageDom = document.getElementById(image);

      const aspect = imageDom.width / imageDom.height;
      const displaySize = Math.random() * (width / 20) + 3;

      // if (Math.random() > 0.95) {
      //   displaySize = Math.random() * 300;
      // }
      // ctx.restore();
      // ctx.re();
      const imageWidth = displaySize;
      const imageHeight = displaySize / aspect;
      let imageX = Math.floor(Math.random() * (width - (displaySize * 2))) + displaySize;
      let imageY = Math.floor(Math.random() * (height - (displaySize * 2))) + displaySize;

      if (circular) {
        // const randomX = Math.random() * (width / 2) - (displaySize * 2);
        const velocity = Math.random() * (Math.min(width, height) / 2);
        const direction = Math.random() * Math.PI * 2;
        const xRandom = Math.cos(direction) * velocity;
        const yRandom = Math.sin(direction) * velocity;
        imageX = Math.floor(width / 2 + xRandom);
        imageY = Math.floor(height / 2 + yRandom);
      }

      // console.log('render image', imageDom.width, imageDom.height, imageDom.width / imageDom.height, imageX, imageY, displaySize, displaySize / aspect);

      ctx.save();
      // if (Math.random() > 0.8) {
      //   ctx.globalCompositeOperation = 'darken';
      // }
      // ctx.rotate(Math.random() * Math.PI * 2, imageX + (imageWidth / 2), imageY + (imageHeight / 2));
      ctx.translate(imageX, imageY);
      ctx.rotate(Math.random() * Math.PI * 2, imageX, imageY);
      // ctx.rotate(Math.random() * Math.PI * 2);
      ctx.drawImage(imageDom, 0, 0, imageWidth, imageHeight);
      ctx.restore();
    }
  }

  async glitchCanvas(ctx, width, height) {
    const glitchParams = getRandomGlitchParams();

    const glitchImageData = await glitch(glitchParams)
      .fromImageData(ctx.getImageData(0, 0, width, height))
      .toImageData();

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(glitchImageData, 0, 0);
  }

  rectangleLayer(ctx, width, height) {
    const rectangles = Math.floor(Math.random() * maxRectangles);

    const maxRectangleWidth = width * (1 / 10);
    const maxRectangleHeight = height * (1 / 10);

    ctx.fillStyle = this.baseStyle;
    ctx.strokeStyle = this.baseStyle;

    for (let i = 0; i < rectangles; i++) {
      ctx.strokeRect(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random() * maxRectangleWidth), Math.floor(Math.random() * maxRectangleHeight));
      ctx.fillRect(Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random() * maxRectangleWidth), Math.floor(Math.random() * maxRectangleHeight));
    }
  }

  textLayer(ctx, text, width, height) {

    const maxFontSize = Math.floor(width * (1 / 10));
    const textCount = Math.floor(Math.random() * maxText);

    for (let i = 0; i < textCount; i++) {
      ctx.save();
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      ctx.rotate(Math.random() * Math.PI * 2, x, y);

      ctx.font = `${Math.floor(Math.random() * maxFontSize)}px Arial`;

      const randomTextSubstring = text.substring(Math.floor(Math.random() * (text.length + 1)), Math.floor(Math.random() * (text.length + 1)));

      ctx.fillText(randomTextSubstring, x,y);
      ctx.restore();
    }
  }

  // update(ctx) {
  //   // ctx.fillRect(20 + Math.floor(Math.random() * 100), 20, 20, 20);
  // }
}