import getVideoStream from './streams/video.js';
import getImageHsl from './analyzers/image-hsl.js';

const getHslAverage = (hsl) => {
  const hslSum = hsl.reduce((sum, hsl) => {
    sum.hue += hsl.hue;
    sum.saturation += hsl.saturation;
    sum.lightness += hsl.lightness;

    return sum;
  }, {
    hue: 0,
    saturation: 0,
    lightness: 0,
  });

  return {
    hue: hslSum.hue / hsl.length,
    saturation: hslSum.saturation / hsl.length,
    lightness: hslSum.lightness / hsl.length,
  };
};

const animate = fn => {
  const render = time => {
    requestAnimationFrame(render);
    fn(time);
  };

  render(performance.now());
};

const outputHue = document.getElementById('output-hue');
const outputSaturation = document.getElementById('output-saturation');
const outputLightness = document.getElementById('output-lightness');

const context = document.getElementById('canvas-video').getContext('2d');

const video = document.getElementById('video');
video.addEventListener('loadedmetadata', e => {
  context.canvas.height = video.videoHeight;
  context.canvas.width = video.videoWidth;
  video.play();
});

animate(() => {
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.drawImage(video, 0, 0);

  const hsl = getImageHsl(context.canvas);
  const hslAverage = getHslAverage(hsl);

  outputHue.value = hslAverage.hue;
  outputSaturation.value = hslAverage.saturation;
  outputLightness.value = hslAverage.lightness;
});

(async () => {
  try {
    video.srcObject = await getVideoStream();
  } catch (e) {
    throw new Error(e);
  }
})();
