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
        this.emojiOverlay = null; // Emoji overlay element
        this.currentEmojiClass = null; // Current detected emoji class
        this.currentEmotion = null; // Current detected emotion
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
                const faceBox = detection.detection.box;

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

                // Update emoji overlay
                this.updateEmojiOverlay(maxEmotion, maxValue, faceBox);

                return {
                    emotion: maxEmotion,
                    confidence: maxValue,
                    allExpressions: expressions,
                    faceBox: faceBox,
                    timestamp: new Date().toISOString()
                };
            }

            // Clear canvas and hide overlay if no face detected
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.hideEmojiOverlay();

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

        // Remove emoji overlay
        if (this.emojiOverlay) {
            this.emojiOverlay.remove();
            this.emojiOverlay = null;
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

    // Map detected emotions to product emoji classes
    getProductEmojiClass(emotion, confidence) {
        // Based on detected emotion and confidence, return corresponding emoji class
        const emotionMap = {
            'happy': confidence > 0.7 ? 'emoji-1' : 'emoji-2', // Big grin vs slight smile
            'sad': 'emoji-6', // Sad face
            'angry': 'emoji-11', // Skeptical/annoyed
            'surprised': 'emoji-4', // Surprised open mouth
            'fearful': 'emoji-5', // Worried face
            'disgusted': 'emoji-9', // Slight frown
            'neutral': 'emoji-12' // Neutral face
        };
        return emotionMap[emotion] || 'emoji-12';
    }

    // Create emoji overlay on canvas
    createEmojiOverlay() {
        // Remove existing overlay
        if (this.emojiOverlay) {
            this.emojiOverlay.remove();
        }

        // Create overlay container
        this.emojiOverlay = document.createElement('div');
        this.emojiOverlay.className = 'camera-emoji-overlay';
        this.emojiOverlay.innerHTML = `
            <div class="emoji-overlay-content">
                <div class="emoji">
                    <div class="eye-left"></div>
                    <div class="eye-right"></div>
                    <div class="mouth"></div>
                </div>
                <p class="emoji-overlay-label">Detected</p>
                <button class="emoji-overlay-add-btn">
                    <span class="add-icon">+</span>
                    <span class="add-text">Add to Cart</span>
                </button>
            </div>
        `;

        // Insert after canvas
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.appendChild(this.emojiOverlay);
        }

        // Add click handler for add button
        const addButton = this.emojiOverlay.querySelector('.emoji-overlay-add-btn');
        addButton.addEventListener('click', () => {
            this.addCurrentEmojiToCart();
        });

        return this.emojiOverlay;
    }

    // Update emoji overlay with detected emotion
    updateEmojiOverlay(emotion, confidence, faceBox) {
        if (!this.emojiOverlay) {
            this.createEmojiOverlay();
        }

        // Get emoji class for this emotion
        const emojiClass = this.getProductEmojiClass(emotion, confidence);

        // Store current emoji info
        this.currentEmojiClass = emojiClass;
        this.currentEmotion = emotion;

        // Update emoji class
        const emojiElement = this.emojiOverlay.querySelector('.emoji');
        emojiElement.className = `emoji ${emojiClass}`;

        // Update label with emotion name
        const label = this.emojiOverlay.querySelector('.emoji-overlay-label');
        label.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);

        // Show overlay with animation (positioned via CSS, not on face)
        this.emojiOverlay.classList.add('active');
    }

    // Hide emoji overlay
    hideEmojiOverlay() {
        if (this.emojiOverlay) {
            this.emojiOverlay.classList.remove('active');
        }
    }

    // Map emoji class to product index
    getProductIndexFromEmojiClass(emojiClass) {
        const emojiToProductMap = {
            'emoji-1': 0,   // Big Grin - Joyful, Excited
            'emoji-2': 1,   // Slight Smile - Content, Peaceful
            'emoji-3': 2,   // Wink - Playful, Cheeky
            'emoji-4': 3,   // Surprised - Surprised, Amazed
            'emoji-5': 4,   // Worried - Worried, Anxious
            'emoji-6': 5,   // Sad - Sad, Empathetic
            'emoji-7': 6,   // Closed Eyes Smile - Blissful, Peaceful
            'emoji-8': 7,   // Sleepy - Tired, Sleepy
            'emoji-9': 8,   // Slight Frown - Disappointed, Meh
            'emoji-10': 9,  // Star Eyes - Starstruck, Excited
            'emoji-11': 10, // Skeptical - Skeptical, Doubtful
            'emoji-12': 11  // Neutral - Neutral, Indifferent
        };
        return emojiToProductMap[emojiClass] ?? 0;
    }

    // Add current detected emoji to cart
    addCurrentEmojiToCart() {
        if (!this.currentEmojiClass) return;

        const productIndex = this.getProductIndexFromEmojiClass(this.currentEmojiClass);

        // Trigger add to cart event
        const event = new CustomEvent('addEmojiToCart', {
            detail: { productIndex, emojiClass: this.currentEmojiClass, emotion: this.currentEmotion }
        });
        window.dispatchEvent(event);

        // Visual feedback - pulse the button
        const addButton = this.emojiOverlay?.querySelector('.emoji-overlay-add-btn');
        if (addButton) {
            addButton.classList.add('added');
            setTimeout(() => {
                addButton.classList.remove('added');
            }, 500);
        }
    }
}
