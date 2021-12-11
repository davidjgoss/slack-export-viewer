var colorPicker;

window.addEventListener('load', startup, false);

function startup() {
  colorPicker = document.querySelector('#colorPicker');
  
  color = getColor('color');
  if (color) {
    colorPicker.value = color;
  }

  colorPicker.addEventListener('input', update, false);
  colorPicker.addEventListener('change', setColor, false);
  colorPicker.select();

  updateUI(colorPicker.value)

}

function update(event) {
  updateUI(event.target.value)
}

function updateUI(color){
  hsl = toHSL(color)
  document.documentElement.style.setProperty('--h', hsl[0]);
  document.documentElement.style.setProperty('--s', hsl[1] + '%');
  document.documentElement.style.setProperty('--l', hsl[2] + '%');
}


function setColor(event) {
  window.localStorage.setItem('color',event.target.value)
}


function getColor(cname) {
  return window.localStorage.getItem('color')
}

function toHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  s = s*100;
  s = Math.round(s);
  l = l*100;
  l = Math.round(l);
  h = Math.round(360*h);

  return [h,s,l];
}

function openColorPicker(){
  colorPicker.click();
}
