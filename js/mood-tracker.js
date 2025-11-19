/**
 * Mood Tracker
 * Manages mood data storage, retrieval, and dashboard updates
 */

class MoodTracker {
    constructor() {
        this.storageKey = 'moodShop_moodData';
        this.emotionDetector = new EmotionDetector();
    }

    /**
     * Save emotion data to local storage
     */
    saveEmotion(emotionData) {
        const today = this.getTodayDateString();
        const allData = this.getAllMoodData();

        if (!allData[today]) {
            allData[today] = [];
        }

        allData[today].push({
            emotion: emotionData.emotion,
            confidence: emotionData.confidence,
            timestamp: emotionData.timestamp,
            expressions: emotionData.allExpressions
        });

        localStorage.setItem(this.storageKey, JSON.stringify(allData));
    }

    /**
     * Get all mood data from storage
     */
    getAllMoodData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    /**
     * Get today's mood data
     */
    getTodayMoodData() {
        const today = this.getTodayDateString();
        const allData = this.getAllMoodData();
        return allData[today] || [];
    }

    /**
     * Get mood statistics for today
     */
    getTodayStats() {
        const todayData = this.getTodayMoodData();

        if (todayData.length === 0) {
            return null;
        }

        // Count occurrences of each emotion
        const emotionCounts = {};
        todayData.forEach(entry => {
            emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
        });

        // Find dominant emotion
        let dominantEmotion = null;
        let maxCount = 0;
        Object.keys(emotionCounts).forEach(emotion => {
            if (emotionCounts[emotion] > maxCount) {
                maxCount = emotionCounts[emotion];
                dominantEmotion = emotion;
            }
        });

        // Calculate percentages
        const total = todayData.length;
        const emotionPercentages = {};
        Object.keys(emotionCounts).forEach(emotion => {
            emotionPercentages[emotion] = ((emotionCounts[emotion] / total) * 100).toFixed(1);
        });

        return {
            totalReadings: total,
            emotionCounts,
            emotionPercentages,
            dominantEmotion,
            firstReading: todayData[0].timestamp,
            lastReading: todayData[todayData.length - 1].timestamp
        };
    }

    /**
     * Get mood history (last 7 days)
     */
    getMoodHistory(days = 7) {
        const allData = this.getAllMoodData();
        const history = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = this.formatDateString(date);

            const dayData = allData[dateStr] || [];

            if (dayData.length > 0) {
                // Find dominant emotion for the day
                const emotionCounts = {};
                dayData.forEach(entry => {
                    emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
                });

                let dominantEmotion = null;
                let maxCount = 0;
                Object.keys(emotionCounts).forEach(emotion => {
                    if (emotionCounts[emotion] > maxCount) {
                        maxCount = emotionCounts[emotion];
                        dominantEmotion = emotion;
                    }
                });

                history.push({
                    date: dateStr,
                    dominantEmotion,
                    totalReadings: dayData.length,
                    emotionCounts
                });
            } else {
                history.push({
                    date: dateStr,
                    dominantEmotion: null,
                    totalReadings: 0,
                    emotionCounts: {}
                });
            }
        }

        return history;
    }

    /**
     * Update the mood dashboard UI
     */
    updateDashboard() {
        const stats = this.getTodayStats();
        const statsContainer = document.getElementById('mood-stats');

        if (!stats) {
            statsContainer.innerHTML = '<p>No mood data for today yet. Start the camera to begin tracking!</p>';
            return;
        }

        const emoji = this.emotionDetector.getEmotionEmoji(stats.dominantEmotion);

        let html = `
            <div class="stat-card">
                <h4>Dominant Mood</h4>
                <div class="emotion-large">${emoji} ${stats.dominantEmotion}</div>
            </div>
            <div class="stat-card">
                <h4>Total Readings</h4>
                <div class="stat-value">${stats.totalReadings}</div>
            </div>
            <div class="mood-breakdown">
                <h4>Emotion Breakdown</h4>
                <div class="emotion-bars">
        `;

        Object.keys(stats.emotionPercentages).forEach(emotion => {
            const percentage = stats.emotionPercentages[emotion];
            const emoji = this.emotionDetector.getEmotionEmoji(emotion);
            html += `
                <div class="emotion-bar-item">
                    <span class="emotion-label">${emoji} ${emotion}</span>
                    <div class="emotion-bar-container">
                        <div class="emotion-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="emotion-percent">${percentage}%</span>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        statsContainer.innerHTML = html;
    }

    /**
     * Update mood history display
     */
    updateHistory() {
        const history = this.getMoodHistory();
        const historyContainer = document.getElementById('mood-history');

        if (history.every(day => day.totalReadings === 0)) {
            historyContainer.innerHTML = '<p>No mood history available yet</p>';
            return;
        }

        let html = '<div class="history-timeline">';

        history.forEach(day => {
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            if (day.totalReadings > 0) {
                const emoji = this.emotionDetector.getEmotionEmoji(day.dominantEmotion);
                html += `
                    <div class="history-item">
                        <div class="history-date">${formattedDate}</div>
                        <div class="history-emotion">${emoji} ${day.dominantEmotion}</div>
                        <div class="history-count">${day.totalReadings} readings</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="history-item history-item-empty">
                        <div class="history-date">${formattedDate}</div>
                        <div class="history-emotion">No data</div>
                    </div>
                `;
            }
        });

        html += '</div>';
        historyContainer.innerHTML = html;
    }

    /**
     * Initialize mood tracking with camera
     */
    async startTracking(videoElement, canvasElement) {
        try {
            await this.emotionDetector.startVideo(videoElement, canvasElement);

            // Start emotion detection with callback
            this.emotionDetector.startDetection((emotionData) => {
                this.saveEmotion(emotionData);
                this.updateCurrentEmotion(emotionData);
                this.updateDashboard();
                this.updateHistory();
            }, 3000); // Detect every 3 seconds

            return true;
        } catch (error) {
            console.error('Error starting mood tracking:', error);
            throw error;
        }
    }

    /**
     * Stop mood tracking
     */
    stopTracking() {
        this.emotionDetector.stopVideo();
    }

    /**
     * Update current emotion display
     */
    updateCurrentEmotion(emotionData) {
        const emotionDisplay = document.getElementById('emotion-display');
        const confidenceDisplay = document.getElementById('emotion-confidence');

        if (emotionDisplay && emotionData) {
            const emoji = this.emotionDetector.getEmotionEmoji(emotionData.emotion);
            emotionDisplay.textContent = `${emoji} ${emotionData.emotion}`;

            if (confidenceDisplay) {
                const confidence = (emotionData.confidence * 100).toFixed(1);
                confidenceDisplay.innerHTML = `
                    <div class="confidence-bar-container">
                        <div class="confidence-bar" style="width: ${confidence}%"></div>
                    </div>
                    <span class="confidence-text">${confidence}% confidence</span>
                `;
            }
        }
    }

    /**
     * Helper: Get today's date as string (YYYY-MM-DD)
     */
    getTodayDateString() {
        return this.formatDateString(new Date());
    }

    /**
     * Helper: Format date as YYYY-MM-DD
     */
    formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
