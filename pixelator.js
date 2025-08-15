const els = {
  file: document.getElementById('file'),
  display: document.getElementById('display'),
  base: document.getElementById('base'),
  small: document.getElementById('small'),
  pixelSize: document.getElementById('pixelSize'),
  showGrid: document.getElementById('showGrid'),
  gridColor: document.getElementById('gridColor'),
  gridAlpha: document.getElementById('gridAlpha'),
  downloadBtn: document.getElementById('downloadBtn'),
};

let imgW = 0, imgH = 0, imgLoaded = false;
const baseCtx = els.base.getContext('2d');
const smallCtx = els.small.getContext('2d');
const dispCtx = els.display.getContext('2d');

function loadImage(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    imgLoaded = true;
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    els.base.width = imgW;
    els.base.height = imgH;
    baseCtx.drawImage(img, 0, 0);
    render();
    els.downloadBtn.disabled = false;
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function render() {
  if (!imgLoaded) return;

  let pxSize = parseInt(els.pixelSize.value, 10);
  if (isNaN(pxSize) || pxSize <= 0) pxSize = 8;

  const smallW = Math.ceil(imgW / pxSize);
  const smallH = Math.ceil(imgH / pxSize);
  els.small.width = smallW;
  els.small.height = smallH;
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.clearRect(0, 0, smallW, smallH);
  smallCtx.drawImage(els.base, 0, 0, smallW, smallH);

  const outW = smallW * pxSize;
  const outH = smallH * pxSize;
  els.display.width = outW;
  els.display.height = outH;
  dispCtx.imageSmoothingEnabled = false;
  dispCtx.clearRect(0, 0, outW, outH);
  dispCtx.drawImage(els.small, 0, 0, outW, outH);

  if (els.showGrid.checked) {
    let alpha = parseFloat(els.gridAlpha.value);
    if (isNaN(alpha)) alpha = 0.6;
    dispCtx.save();
    dispCtx.globalAlpha = alpha;
    dispCtx.strokeStyle = els.gridColor.value;
    dispCtx.beginPath();
    for (let x = 0; x <= outW; x += pxSize) {
      dispCtx.moveTo(x + 0.5, 0);
      dispCtx.lineTo(x + 0.5, outH);
    }
    for (let y = 0; y <= outH; y += pxSize) {
      dispCtx.moveTo(0, y + 0.5);
      dispCtx.lineTo(outW, y + 0.5);
    }
    dispCtx.stroke();
    dispCtx.restore();
  }
}

function downloadPNG() {
  const link = document.createElement('a');
  link.download = 'pixelated.png';
  link.href = els.display.toDataURL();
  link.click();
}

// Events
els.file.addEventListener('change', e => {
  if (e.target.files[0]) loadImage(e.target.files[0]);
});
['input', 'change'].forEach(ev => {
  els.pixelSize.addEventListener(ev, render);
  els.showGrid.addEventListener(ev, render);
  els.gridColor.addEventListener(ev, render);
  els.gridAlpha.addEventListener(ev, render);
});
els.downloadBtn.addEventListener('click', downloadPNG);
