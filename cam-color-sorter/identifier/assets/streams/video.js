export default async (width = 256, height = 256) => navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    height,
    width,
  },
});
