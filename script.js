const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const drawCanvas = document.getElementById('drawCanvas');
const canvasCtx = canvasElement.getContext('2d');
const drawCtx = drawCanvas.getContext('2d');
const toggleBtn = document.getElementById('toggleCam');

const statusEl = document.getElementById('status');
const handCountEl = document.getElementById('handCount');
const gestureEl = document.getElementById('gesture');
const gestureIconEl = document.getElementById('gestureIcon');
const gestureHistoryEl = document.getElementById('gestureHistory');
const musicPlayer = document.getElementById('musicPlayer');

let isCameraOn = true;
let lastGestureSpoken = '';
let gestureLog = [];
let prevX = null, prevY = null;

// Set draw canvas size
drawCanvas.width = canvasElement.width;
drawCanvas.height = canvasElement.height;

// Gesture Emojis
const gestureEmojis = {
  'Thumbs Up': '👍',
  'Fist': '✊',
  'Open Palm': '🖐️',
  'Pointing': '👉',
  'Unknown Gesture': '❓'
};

// Speech Function
function speakGesture(gesture) {
  if ('speechSynthesis' in window && gesture !== lastGestureSpoken) {
    const utterance = new SpeechSynthesisUtterance(gesture);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    lastGestureSpoken = gesture;
  }
}

// Gesture History
function updateGestureHistory(newGesture) {
  const timestamp = new Date().toLocaleTimeString();
  gestureLog.unshift(`${timestamp}: ${newGesture}`);
  if (gestureLog.length > 5) gestureLog.pop();

  gestureHistoryEl.innerHTML = '';
  gestureLog.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    gestureHistoryEl.appendChild(li);
  });
}

// Music Controls
function controlMusic(gesture) {
  if (gesture === 'Thumbs Up') {
    musicPlayer.play();
  } else if (gesture === 'Fist') {
    musicPlayer.pause();
  } else if (gesture === 'Pointing') {
    musicPlayer.currentTime += 5;
  } else if (gesture === 'Open Palm') {
    musicPlayer.currentTime = 0;
  }
}

// Drawing Controls
function controlDrawing(gesture, indexTip) {
  if (gesture === 'Open Palm') {
    const x = indexTip.x * drawCanvas.width;
    const y = indexTip.y * drawCanvas.height;

    if (prevX !== null && prevY !== null) {
      drawCtx.beginPath();
      drawCtx.moveTo(prevX, prevY);
      drawCtx.lineTo(x, y);
      drawCtx.strokeStyle = '#2563eb';
      drawCtx.lineWidth = 4;
      drawCtx.stroke();
    }
    prevX = x;
    prevY = y;
  } 
  else if (gesture === 'Fist') {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    prevX = prevY = null;
  } 
  else {
    prevX = prevY = null;
  }
}

// MediaPipe Hands Setup
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

// Detect gesture
function detectGesture(landmarks) {
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  const dThumbWrist = distance(thumbTip, wrist);
  const dIndexWrist = distance(indexTip, wrist);
  const dMiddleWrist = distance(middleTip, wrist);
  const dRingWrist = distance(ringTip, wrist);
  const dPinkyWrist = distance(pinkyTip, wrist);

  const isThumbUp = 
    thumbTip.y < wrist.y &&
    indexTip.y > wrist.y &&
    middleTip.y > wrist.y &&
    ringTip.y > wrist.y &&
    pinkyTip.y > wrist.y &&
    dThumbWrist > dIndexWrist * 0.8;

  if (isThumbUp) return 'Thumbs Up';

  const isPalmOpen = 
    thumbTip.y < wrist.y &&
    indexTip.y < wrist.y &&
    middleTip.y < wrist.y &&
    ringTip.y < wrist.y &&
    pinkyTip.y < wrist.y;

  if (isPalmOpen) return 'Open Palm';

  const isFist = 
    dThumbWrist < 0.1 && 
    dIndexWrist < 0.1 && 
    dMiddleWrist < 0.1 &&
    dRingWrist < 0.1 && 
    dPinkyWrist < 0.1;

  if (isFist) return 'Fist';

  const isPointing =
    indexTip.y < wrist.y &&
    middleTip.y > wrist.y &&
    ringTip.y > wrist.y &&
    pinkyTip.y > wrist.y;

  if (isPointing) return 'Pointing';

  return 'Unknown Gesture';
}

// Handle Results
hands.onResults(results => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks.length > 0) {
    handCountEl.textContent = results.multiHandLandmarks.length;

    const hand = results.multiHandLandmarks[0];
    const gestureName = detectGesture(hand);
    gestureEl.textContent = gestureName;
    gestureIconEl.textContent = gestureEmojis[gestureName] || '';

    speakGesture(gestureName);
    updateGestureHistory(gestureName);
    controlMusic(gestureName);
    controlDrawing(gestureName, hand[8]);

    results.multiHandLandmarks.forEach(landmarks => {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    });
  } else {
    handCountEl.textContent = '0';
    gestureEl.textContent = 'No Hand';
    gestureIconEl.textContent = '';
    lastGestureSpoken = '';
    prevX = prevY = null;
  }

  canvasCtx.restore();
});

// ✅ Start Camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    statusEl.textContent = "Camera Running";

    videoElement.onloadedmetadata = () => {
      videoElement.play();
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
      });
      camera.start();
    };
  } catch (error) {
    statusEl.textContent = "Camera Access Denied!";
    console.error("Camera Error:", error);
  }
}

startCamera();

// Toggle Camera
toggleBtn.addEventListener('click', async () => {
  if (isCameraOn) {
    let tracks = videoElement.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());
    videoElement.srcObject = null;
    statusEl.textContent = "Camera Off";
    toggleBtn.textContent = "Turn Camera On";
  } else {
    await startCamera();
    statusEl.textContent = "Camera Running";
    toggleBtn.textContent = "Turn Camera Off";
  }
  isCameraOn = !isCameraOn;
});
