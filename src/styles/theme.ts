export const getColorWithOpacity = (rgbaSrc: string, opacity: number) => {
  return rgbaSrc.substr(0, rgbaSrc.lastIndexOf(',') + 2) + opacity / 100 + ')';
};

export const getMultipliedColor = (rgbaSrc: string, multiplier: number) => {
  var newColor = 'rgba(';

  var startIndex = rgbaSrc.indexOf('(') + 1;
  var endIndex = rgbaSrc.indexOf(',');
  var red = rgbaSrc.substr(startIndex, endIndex);
  newColor += Math.round(parseInt(red) * multiplier) + ', ';

  startIndex = rgbaSrc.indexOf(',', startIndex) + 1;
  endIndex = rgbaSrc.indexOf(',', endIndex);
  var green = rgbaSrc.substr(startIndex, endIndex);
  newColor += Math.round(parseInt(green) * multiplier) + ', ';

  startIndex = rgbaSrc.indexOf(',', startIndex) + 1;
  endIndex = rgbaSrc.indexOf(',', endIndex);
  var blue = rgbaSrc.substr(startIndex, endIndex);
  newColor += Math.round(parseInt(blue) * multiplier) + ', 1)';

  return newColor;
};

export const defaultTheme = {
  colors: {
    primary: 'rgb(0, 68, 102, 1)',
    accent: 'rgba(0, 187, 255, 1)',
    success: 'rgba(102, 221, 0)',
    info: 'rgba(0, 187, 255, 1)',
    warning: 'rgba(255, 188, 69, 1)',
    question: 'rgba(255, 188, 69, 1)',
    danger: 'rgba(255, 64, 64, 1)',
    error: 'rgba(255, 64, 64, 1)',
    black: 'rgba(0, 0, 0, 1)',
    white: 'rgba(255, 255, 255, 1)',
    background: '#f0f0f0',
  },
  nav: {
    background: '#f3f3f3',
    border: '#b1b1b1',
  },
};
