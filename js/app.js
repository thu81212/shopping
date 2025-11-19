/**
 * Main Application - Updated for new design
 */

document.addEventListener('DOMContentLoaded', () => {
    const moodTracker = new MoodTracker();
    const startButton = document.getElementById('start-tracking');
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('overlay');
    const emotionText = document.getElementById('emotion-text');
    const confidenceFill = document.getElementById('confidence-fill');

    let isTracking = false;

    // Start/Stop tracking button
    if (startButton) {
        startButton.addEventListener('click', async () => {
            if (!isTracking) {
                try {
                    startButton.textContent = 'Loading models...';
                    startButton.disabled = true;

                    await moodTracker.startTracking(videoElement, canvasElement);

                    startButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 90 90" fill="none"><rect x="30" y="30" width="10" height="30" fill="currentColor"/><rect x="50" y="30" width="10" height="30" fill="currentColor"/></svg><span>Stop Tracking</span>';
                    startButton.disabled = false;
                    isTracking = true;

                    showNotification('Emotion tracking started!', 'success');
                } catch (error) {
                    console.error('Error starting tracking:', error);
                    showNotification('Failed to start camera: ' + error.message, 'error');
                    startButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="45" r="20" fill="currentColor"/></svg><span>Start Emotion Tracking</span>';
                    startButton.disabled = false;
                }
            } else {
                moodTracker.stopTracking();
                startButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="45" r="20" fill="currentColor"/></svg><span>Start Emotion Tracking</span>';
                isTracking = false;

                // Reset display
                if (emotionText) emotionText.textContent = '---';
                if (confidenceFill) confidenceFill.style.width = '0%';

                showNotification('Tracking stopped', 'info');
            }
        });
    }

    // Update emotion display
    moodTracker.emotionDetector.onEmotionDetected = (emotionData) => {
        if (emotionText && emotionData) {
            const emoji = moodTracker.emotionDetector.getEmotionEmoji(emotionData.emotion);
            emotionText.textContent = `${emoji} ${emotionData.emotion}`;
        }

        if (confidenceFill && emotionData) {
            const confidence = (emotionData.confidence * 100).toFixed(1);
            confidenceFill.style.width = `${confidence}%`;
        }

        // Save and update dashboard
        if (emotionData) {
            moodTracker.saveEmotion(emotionData);
            moodTracker.updateDashboard();
            moodTracker.updateHistory();
        }
    };

    // Load initial data
    moodTracker.updateDashboard();
    moodTracker.updateHistory();

    console.log('Shoppy Emotions initialized!');
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
