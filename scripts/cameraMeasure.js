let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let captureBtn = document.getElementById('capture-btn');
let uploadBtn = document.getElementById('upload-btn');
let fileInput = document.getElementById('file-input');
let calibrateBtn = document.getElementById('calibrate-btn');
let measureBtn = document.getElementById('measure-btn');
let result = document.getElementById('result');
let instructions = document.getElementById('instructions');
let calibrationInstructions = document.getElementById('calibration-instructions');

let isDrawing = false;
let isCalibrating = false;
let startX, startY, endX, endY;
let pixelToMmRatio = 0.1;
let calibrationImage;
let measurementImage;
const fatPadLength = 10; // Add 10 mm to account for the fat pad

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            video.play();
            resolve();
        };
    });
}

function showVideo() {
    video.style.display = 'block';
    canvas.style.display = 'none';
    captureBtn.style.display = 'block';
    uploadBtn.style.display = 'block';
    calibrateBtn.style.display = 'none';
    measureBtn.style.display = 'none';
    instructions.innerText = "Capture or upload an image for calibration.";
    calibrationInstructions.style.display = 'none';
}

function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    calibrationImage = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    startCalibration();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            calibrationImage = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            startCalibration();
        }
        img.src = e.target.result;
    }

    reader.readAsDataURL(file);
}

function startCalibration() {
    isCalibrating = true;
    instructions.innerText = "Draw a line along the long edge of the card.";
    calibrationInstructions.style.display = 'block';
    canvas.style.display = 'block';
    video.style.display = 'none';
    captureBtn.style.display = 'none';
    uploadBtn.style.display = 'none';
    calibrateBtn.style.display = 'none';
    measureBtn.style.display = 'none';
    canvas.getContext('2d').putImageData(calibrationImage, 0, 0);
    canvas.addEventListener('mousedown', startLine);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', endCalibrationLine);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', endCalibrationLine);
}

function startMeasurement() {
    isCalibrating = false;
    instructions.innerText = "Draw a line from the base to the tip of the penis.";
    calibrationInstructions.style.display = 'none';
    canvas.style.display = 'block';
    video.style.display = 'none';
    captureBtn.style.display = 'none';
    uploadBtn.style.display = 'none';
    calibrateBtn.style.display = 'none';
    measureBtn.style.display = 'none';
    canvas.getContext('2d').putImageData(measurementImage, 0, 0);
    canvas.addEventListener('mousedown', startLine);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', endMeasurementLine);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', endMeasurementLine);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) * (canvas.width / rect.width),
        y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function getTouchPos(canvas, touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startLine(e) {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    [startX, startY] = [pos.x, pos.y];
}

function drawLine(e) {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    [endX, endY] = [pos.x, pos.y];
    const ctx = canvas.getContext('2d');
    ctx.putImageData(isCalibrating ? calibrationImage : measurementImage, 0, 0);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        isDrawing = true;
        const pos = getTouchPos(canvas, e.touches[0]);
        [startX, startY] = [pos.x, pos.y];
    } else if (e.type === 'touchmove' && isDrawing) {
        const pos = getTouchPos(canvas, e.touches[0]);
        [endX, endY] = [pos.x, pos.y];
        drawLine(e.touches[0]);
    }
}

function endCalibrationLine() {
    isDrawing = false;
    instructions.innerText = "Select the type of card you used.";
    const cardType = prompt("What type of card did you use?\n1. Credit/Debit Card\n2. ID Card\n(Enter 1 or 2)");
    let cardLength;
    if (cardType === "1") {
        cardLength = 85.60; // Standard credit card length in mm
    } else if (cardType === "2") {
        cardLength = 85.73; // Standard ID card length in mm
    } else {
        instructions.innerText = "Invalid selection. Please try calibration again.";
        return;
    }

    const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    pixelToMmRatio = cardLength / lineLength;
    instructions.innerText = `Calibration successful! Scale: 1 pixel = ${pixelToMmRatio.toFixed(4)} mm. Now, capture or upload the image you want to measure.`;
    removeEventListeners();
    showCaptureMeasurementButton();
}

function showCaptureMeasurementButton() {
    captureBtn.style.display = 'block';
    uploadBtn.style.display = 'block';
    calibrateBtn.style.display = 'none';
    measureBtn.style.display = 'none';
    captureBtn.textContent = 'Capture Measurement Image';
    uploadBtn.textContent = 'Upload Measurement Image';
    showVideo();
}

function captureMeasurementImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    measurementImage = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    startMeasurement();
}

function handleMeasurementFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            measurementImage = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            startMeasurement();
        }
        img.src = e.target.result;
    }

    reader.readAsDataURL(file);
}

function endMeasurementLine() {
    isDrawing = false;
    calculateMeasurement();
}

function calculateMeasurement() {
    const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const sizeInMm = lineLength * pixelToMmRatio + fatPadLength;
    const sizeInCm = sizeInMm / 10;
    const sizeInInches = sizeInCm / 2.54;

    result.innerHTML = `Erect length: Approximately ${sizeInCm.toFixed(1)} cm (${sizeInInches.toFixed(1)} inches)`;
    removeEventListeners();
}

function removeEventListeners() {
    canvas.removeEventListener('mousedown', startLine);
    canvas.removeEventListener('mousemove', drawLine);
    canvas.removeEventListener('mouseup', endCalibrationLine);
    canvas.removeEventListener('mouseup', endMeasurementLine);
    canvas.removeEventListener('touchstart', handleTouch);
    canvas.removeEventListener('touchmove', handleTouch);
    canvas.removeEventListener('touchend', endCalibrationLine);
    canvas.removeEventListener('touchend', endMeasurementLine);
}

async function init() {
    await setupCamera();
    showVideo();
}

init();
captureBtn.addEventListener('click', function() {
    if (captureBtn.textContent === 'Capture Measurement Image') {
        captureMeasurementImage();
    } else {
        captureImage();
    }
});
uploadBtn.addEventListener('click', function() {
    if (uploadBtn.textContent === 'Upload Measurement Image') {
        fileInput.onchange = handleMeasurementFileUpload;
    } else {
        fileInput.onchange = handleFileUpload;
    }
    fileInput.click();
});
fileInput.addEventListener('change', handleFileUpload);
calibrateBtn.addEventListener('click', startCalibration);
measureBtn.addEventListener('click', startMeasurement);