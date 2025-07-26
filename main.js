const inputCanvas = document.getElementById('inputCanvas');
const inputCtx = inputCanvas.getContext('2d');
const canvas = document.getElementById('stringCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const generateBtn = document.getElementById('generateBtn');

const pinCount = 200;
const iterations = 2000;
let imageData;
let pins = [];

upload.addEventListener('change', e => {
  const img = new Image();
  img.onload = () => {
    inputCanvas.width = canvas.width;
    inputCanvas.height = canvas.height;
    inputCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageData = inputCtx.getImageData(0, 0, canvas.width, canvas.height);
    drawPins();
  };
  img.src = URL.createObjectURL(e.target.files[0]);
});

generateBtn.addEventListener('click', () => {
  if (!imageData) return alert('Upload an image first!');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let current = 0;
  for (let i = 0; i < iterations; i++) {
    let best = Infinity;
    let next = 0;
    for (let j = 0; j < pins.length; j++) {
      if (j === current) continue;
      const score = lineBrightness(pins[current], pins[j]);
      if (score < best) {
        best = score;
        next = j;
      }
    }
    drawLine(pins[current], pins[next]);
    current = next;
  }
});

function drawPins() {
  pins = [];
  const r = canvas.width * 0.48;
  const cx = cy = canvas.width / 2;
  for (let i = 0; i < pinCount; i++) {
    const a = (i / pinCount) * 2 * Math.PI;
    pins.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
}

function brightness(x, y) {
  const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
  return imageData.data[i];
}

function lineBrightness(p1, p2) {
  let sum = 0;
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = p1[0] + t * (p2[0] - p1[0]);
    const y = p1[1] + t * (p2[1] - p1[1]);
    sum += brightness(x, y);
  }
  return sum;
}

function drawLine(p1, p2) {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.moveTo(...p1);
  ctx.lineTo(...p2);
  ctx.stroke();
}
