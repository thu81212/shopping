/**
 * Emotion Detector using face-api.js
 * Handles facial detection and emotion recognition from webcam
 */

class EmotionDetector {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.displaySize = null;
        this.isRunning = false;
        this.detectionInterval = null;
        this.modelsLoaded = false;
        this.onEmotionDetected = null; // Callback for emotion detection
    }

    async loadModels() {
        if (this.modelsLoaded) return;

        try {
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';

            console.log('Loading face detection models...');
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

            this.modelsLoaded = true;
            console.log('Models loaded successfully!');
        } catch (error) {
            console.error('Error loading models:', error);
            throw new Error('Failed to load emotion detection models');
        }
    }

    async startVideo(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;

        try {
            // Load models first
            await this.loadModels();

            // Get video stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            this.video.srcObject = stream;

            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.displaySize = {
                        width: this.video.videoWidth,
                        height: this.video.videoHeight
                    };

                    this.canvas.width = this.displaySize.width;
                    this.canvas.height = this.displaySize.height;

                    faceapi.matchDimensions(this.canvas, this.displaySize);
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw new Error('Could not access camera. Please grant camera permissions.');
        }
    }

    async detectEmotion() {
        if (!this.video || this.video.paused) return null;

        try {
            const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections && detections.length > 0) {
                // Get the first detected face
                const detection = detections[0];
                const expressions = detection.expressions;

                // Find the dominant emotion
                let maxEmotion = 'neutral';
                let maxValue = 0;

                Object.keys(expressions).forEach(emotion => {
                    if (expressions[emotion] > maxValue) {
                        maxValue = expressions[emotion];
                        maxEmotion = emotion;
                    }
                });

                // Draw detections on canvas
                this.drawDetections(detections);

                return {
                    emotion: maxEmotion,
                    confidence: maxValue,
                    allExpressions: expressions,
                    timestamp: new Date().toISOString()
                };
            }

            // Clear canvas if no face detected
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            return null;
        } catch (error) {
            console.error('Error detecting emotion:', error);
            return null;
        }
    }

    drawDetections(detections) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const resizedDetections = faceapi.resizeResults(detections, this.displaySize);

        // Draw face detection box
        faceapi.draw.drawDetections(this.canvas, resizedDetections);

        // Draw expressions
        faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections, 0.05);
    }

    startDetection(callback, interval = 1000) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.onEmotionDetected = callback;

        this.detectionInterval = setInterval(async () => {
            const result = await this.detectEmotion();
            if (result && this.onEmotionDetected) {
                this.onEmotionDetected(result);
            }
        }, interval);
    }

    stopDetection() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        this.isRunning = false;
    }

    stopVideo() {
        this.stopDetection();

        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.video.srcObject = null;
        }

        if (this.canvas) {
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    getEmotionEmoji(emotion) {
        const emojiMap = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'disgusted': '🤢',
            'fearful': '😨',
            'surprised': '😲',
            'neutral': '😐'
        };
        return emojiMap[emotion] || '😐';
    }
}
