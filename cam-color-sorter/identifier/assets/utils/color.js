// http://en.wikipedia.org/wiki/HSL_color_space

export default {
  getHslFromRgb(r, g, b) {
    const lightness = this._getLightnessFromRgb(r, g, b);

    return {
      hue: this._getHueFromRgb(r, g, b),
      lightness,
      saturation: this._getSaturationFromRgb(r, g, b, lightness),
    };
  },

  _getHueFromRgb(r, g, b) {
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const d = max - min;

    if (d === 0) {
      return 0;
    }

    switch(max){
      case r:
       return ((g - b) / d + (g < b ? 6 : 0)) / 6;
      case g:
        return ((b - r) / d + 2) / 6;
      case b:
        return ((r - g) / d + 4) / 6;
      default:
        return 0;
    }
  },

  _getLightnessFromRgb(r, g, b) {
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  },

  _getSaturationFromRgb(r, g, b, lightness) {
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const d = max - min;

    if (d === 0) {
      return 0;
    }

    return lightness > 0.5
      ? d / (2 - d)
      : d / (max + min);
  },
};