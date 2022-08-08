import * as dat from 'https://cdn.skypack.dev/dat.gui';
console.clear();

const twodWebGL = new WTCGL(
document.querySelector('canvas#webgl'),
document.querySelector('script#vertexShader').textContent,
document.querySelector('script#fragmentShader').textContent,
window.innerWidth,
window.innerHeight,
window.devicePixelRatio);


console.log(twodWebGL);

window.addEventListener('resize', () => {
  twodWebGL.resize(window.innerWidth, window.innerHeight);
});



// track mouse move
let mousepos = [0, 0];
const u_mousepos = twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
window.addEventListener('pointermove', e => {
  let ratio = window.innerHeight / window.innerWidth;
  if (window.innerHeight > window.innerWidth) {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1 * ratio;
  } else {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;
  }
  twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
});

const uniforms = {
  octaves: {
    v: 3,
    max: 12,
    min: 0,
    type: WTCGL.TYPE_INT },
  sceneWeight: {
    v: 1,
    max: 10,
    min: .01,
    type: WTCGL.TYPE_FLOAT },
  maxIterations: {
    v: 256,
    max: 512,
    min: 2,
    type: WTCGL.TYPE_INT },
  internalStep: {
    v: .003,
    max: 1,
    min: 0.0001,
    type: WTCGL.TYPE_FLOAT },
  stopThreshold: {
    v: .01,
    max: .1,
    min: .0001,
    type: WTCGL.TYPE_FLOAT },
  stepScale: {
    v: .8,
    max: 2.,
    min: .1,
    type: WTCGL.TYPE_FLOAT },
  clipBGColour: {
    v: '#000000',
    type: 'COLOUR' },
  blobColour: {
    v: '#FFFFFF',
    type: 'COLOUR' },
  lightColour: {
    v: '#3F66FF',
    type: 'COLOUR' },
  lightStrength: {
    v: 2,
    min: .1,
    max: 5,
    type: WTCGL.TYPE_FLOAT } };



const hexToGL = hex => {
  const components = /^#?([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/i.exec(hex);
  if (components && components.length === 4) {
    const r = Math.round(`0x${components[1]}` / 255 * 1000) / 1000;
    const g = Math.round(`0x${components[2]}` / 255 * 1000) / 1000;
    const b = Math.round(`0x${components[3]}` / 255 * 1000) / 1000;
    return [r, g, b];
  } else {
    return [];
  }
};
const updateUniform = (e, n) => {
  const prop = uniforms[e];
  if (prop.type === 'COLOUR') {
    const c = hexToGL(n);
    twodWebGL.addUniform(e, WTCGL.TYPE_V3, c);
  } else {
    twodWebGL.addUniform(e, prop.type, n);
  }
};

// const updateUniform(name, value) => {

// }

// const gui = new dat.GUI();
Object.entries(uniforms).forEach((u, v) => {
  console.log(u);
  const prop = uniforms[u[0]];
  if (prop.type === 'COLOUR') {
    const c = hexToGL(prop.v);
    console.log(c);
    twodWebGL.addUniform(u[0], WTCGL.TYPE_V3, c);
  } else {
    twodWebGL.addUniform(u[0], prop.type, prop.v);
  }
  if (prop.type === 'COLOUR') {
    // gui.addColor(prop, 'v').name(u[0]).onChange((v) => { updateUniform(u[0], v) });
  } else {
      // gui.add(prop, 'v', prop.min, prop.max).name(u[0]).onChange((v) => { updateUniform(u[0], v) });
    }
});










// Load all our textures. We only initiate the instance once all images are loaded.
const textures = [
{
  name: 'noise',
  url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png',
  type: WTCGL.IMAGETYPE_TILE,
  img: null }];


const loadImage = function (imageObject) {
  let img = document.createElement('img');
  img.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    img.addEventListener('load', e => {
      imageObject.img = img;
      resolve(imageObject);
    });
    img.addEventListener('error', e => {
      reject(e);
    });
    img.src = imageObject.url;
  });
};
const loadTextures = function (textures) {
  return new Promise((resolve, reject) => {
    const loadTexture = pointer => {
      if (pointer >= textures.length || pointer > 10) {
        resolve(textures);
        return;
      };
      const imageObject = textures[pointer];

      const p = loadImage(imageObject);
      p.then(
      result => {
        twodWebGL.addTexture(result.name, result.type, result.img);
      },
      error => {
        console.log('error', error);
      }).finally(e => {
        loadTexture(pointer + 1);
      });
    };
    loadTexture(0);
  });

};

loadTextures(textures).then(
result => {
  twodWebGL.initTextures();
  // twodWebGL.render();
  twodWebGL.running = true;
},
error => {
  console.log('error');
});