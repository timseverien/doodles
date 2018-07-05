import Color from '../utils/color.js';

export default (canvas) => {
  const imageData = canvas.getContext('2d')
    .getImageData(0, 0, canvas.width, canvas.height);

  return new Array(imageData.height * imageData.width).fill().map((_, i) => {
    const dataIndex = i * 4;

    return Color.getHslFromRgb(
      imageData.data[dataIndex] / 255,
      imageData.data[dataIndex + 1] / 255,
      imageData.data[dataIndex + 2] / 255
    );
  });
};
