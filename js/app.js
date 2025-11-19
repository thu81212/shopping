/**
 * Main Application
 * Initializes and coordinates all components
 */

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mood tracker
    const moodTracker = new MoodTracker();

    // Initialize shop
    const shop = new Shop();

    // Camera control buttons
    const startCameraBtn = document.getElementById('start-camera');
    const stopCameraBtn = document.getElementById('stop-camera');
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('overlay');

    let isCameraRunning = false;

    // Start camera button
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', async () => {
            try {
                startCameraBtn.disabled = true;
                startCameraBtn.textContent = 'Loading models...';

                await moodTracker.startTracking(videoElement, canvasElement);

                startCameraBtn.style.display = 'none';
                stopCameraBtn.disabled = false;
                stopCameraBtn.style.display = 'inline-block';
                isCameraRunning = true;

                // Initial dashboard update
                moodTracker.updateDashboard();
                moodTracker.updateHistory();

                showNotification('Camera started! Emotion tracking is now active.', 'success');
            } catch (error) {
                console.error('Error starting camera:', error);
                showNotification('Failed to start camera: ' + error.message, 'error');
                startCameraBtn.disabled = false;
                startCameraBtn.textContent = 'Start Camera';
            }
        });
    }

    // Stop camera button
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', () => {
            moodTracker.stopTracking();

            startCameraBtn.style.display = 'inline-block';
            startCameraBtn.disabled = false;
            startCameraBtn.textContent = 'Start Camera';
            stopCameraBtn.disabled = true;
            stopCameraBtn.style.display = 'none';
            isCameraRunning = false;

            // Reset current emotion display
            const emotionDisplay = document.getElementById('emotion-display');
            const confidenceDisplay = document.getElementById('emotion-confidence');
            if (emotionDisplay) emotionDisplay.textContent = '---';
            if (confidenceDisplay) confidenceDisplay.innerHTML = '';

            showNotification('Camera stopped', 'info');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#cart') { // Don't prevent cart modal
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Load initial mood data on page load
    moodTracker.updateDashboard();
    moodTracker.updateHistory();

    console.log('MoodShop initialized successfully!');
});

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle page visibility changes (pause/resume camera when tab is hidden/visible)
document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('video');
    if (document.hidden) {
        // Page is hidden, pause video
        if (video && video.srcObject) {
            video.pause();
        }
    } else {
        // Page is visible, resume video
        if (video && video.srcObject) {
            video.play();
        }
    }
});
