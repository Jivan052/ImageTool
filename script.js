const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', loadImage);

function loadImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

function applyFilter(filterType) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
            }
            break;
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = r * 0.393 + g * 0.769 + b * 0.189;
                data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
                data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
            }
            break;
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
        case 'edge':
            // Edge detection requires more complex processing
            // Using a basic implementation with convolution matrix or an advanced library is recommended.
            alert('Edge detection filter is not implemented yet.');
            break;
        default:
            break;
    }

    ctx.putImageData(imageData, 0, 0);
}

function resizeCanvas(scalePercent) {
    const scale = scalePercent / 100;
    const width = canvas.width * scale;
    const height = canvas.height * scale;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, width, height);
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(tempCanvas, 0, 0);
}

function processImage() {
    const filter = document.getElementById('filter').value;
    const scale = document.getElementById('scale').value;
    const quality = document.getElementById('quality').value;

    if (filter !== 'none') applyFilter(filter);
    if (scale) resizeCanvas(scale);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = canvas.toDataURL('image/jpeg', quality / 100);
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Processed Image';
}