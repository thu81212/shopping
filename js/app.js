// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

    // Initialize emotion detector and mood tracker
    const emotionDetector = new EmotionDetector();
    const moodTracker = new MoodTracker();

    // Get elements
    const detectButton = document.querySelector('.detect-button');
    const cartButton = document.querySelector('.cart-button');
    const doubleDown = document.querySelector('.double-down');
    const cameraModal = document.getElementById('camera-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('overlay');
    const emotionText = document.getElementById('emotion-text');
    const confidenceFill = document.getElementById('confidence-fill');

    let isTracking = false;

    // Detect My Emotion Button
    if (detectButton) {
        detectButton.addEventListener('click', function() {
            handleEmotionDetection();
        });
    }

    // Shopping Cart Button
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            handleCartClick();
        });
    }

    // Double Down Arrow
    if (doubleDown) {
        doubleDown.addEventListener('click', function() {
            handleScrollDown();
        });
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeCameraModal();
        });
    }

    // Function to handle emotion detection
    async function handleEmotionDetection() {
        // Check if browser supports camera access
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showNotification('Camera access is not supported in your browser', 'error');
            return;
        }

        try {
            // Show camera modal
            cameraModal.classList.add('active');
            emotionText.textContent = 'Loading models...';

            // Start emotion detection
            await emotionDetector.startVideo(videoElement, canvasElement);
            emotionText.textContent = 'Analyzing your emotion...';

            // Start detection loop
            emotionDetector.startDetection((emotionData) => {
                if (emotionData) {
                    const emoji = emotionDetector.getEmotionEmoji(emotionData.emotion);
                    emotionText.textContent = `${emoji} You seem ${emotionData.emotion}!`;

                    const confidence = (emotionData.confidence * 100).toFixed(1);
                    confidenceFill.style.width = `${confidence}%`;

                    // Save emotion data
                    moodTracker.saveEmotion(emotionData);
                }
            }, 2000);

            isTracking = true;
            showNotification('Camera access granted! Analyzing...', 'success');

        } catch (error) {
            console.error('Camera error:', error);

            if (error.name === 'NotAllowedError') {
                showNotification('Please allow camera access to detect emotions', 'error');
            } else if (error.name === 'NotFoundError') {
                showNotification('No camera found on your device', 'error');
            } else {
                showNotification('Error accessing camera: ' + error.message, 'error');
            }

            closeCameraModal();
        }
    }

    // Function to close camera modal
    function closeCameraModal() {
        if (isTracking) {
            emotionDetector.stopVideo();
            isTracking = false;
        }

        cameraModal.classList.remove('active');
        emotionText.textContent = 'Analyzing...';
        confidenceFill.style.width = '0%';
    }

    // Function to handle cart click
    function handleCartClick() {
        showNotification('Opening shopping cart...', 'info');
        // In a real app, open cart modal or navigate to cart page
    }

    // Function to handle scroll down
    function handleScrollDown() {
        window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Set styles
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#c5504b'
        };

        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${colors[type] || colors.info};
            color: #f5f1e8;
            padding: 15px 30px;
            border-radius: 25px;
            font-family: 'Bagel Fat One', cursive;
            font-size: 18px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Optional: Add parallax effect to decorative elements
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                applyParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    function applyParallax() {
        const scrolled = window.pageYOffset;
        const ellipses = document.querySelectorAll('.ellipse');

        ellipses.forEach((ellipse, index) => {
            const speed = 0.3 + (index * 0.05);
            const yPos = scrolled * speed;
            const currentTransform = ellipse.style.transform || '';
            const rotateMatch = currentTransform.match(/rotate\([^)]+\)/);
            const scaleMatch = currentTransform.match(/scale[^)]*\([^)]+\)/);

            let newTransform = `translateY(${yPos}px)`;
            if (rotateMatch) newTransform += ` ${rotateMatch[0]}`;
            if (scaleMatch) newTransform += ` ${scaleMatch[0]}`;

            ellipse.style.transform = newTransform;
        });
    }

    console.log('Shop Your Emotions initialized!');
});
