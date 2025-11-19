# MoodShop - Emotion Tracking Shopping Website

A modern shopping website with integrated facial emotion tracking that monitors and displays your daily mood expressions while you shop.

## Features

### Shopping Functionality
- Browse a curated product catalog
- Add items to shopping cart
- Adjust quantities and manage cart items
- Responsive product grid layout
- Persistent cart using localStorage
- Checkout functionality

### Emotion Tracking
- Real-time facial emotion detection using camera
- Tracks 7 different emotions:
  - Happy
  - Sad
  - Angry
  - Disgusted
  - Fearful
  - Surprised
  - Neutral
- Live emotion display with confidence levels
- Automatic emotion data collection every 3 seconds

### Mood Dashboard
- Daily mood summary with dominant emotion
- Emotion breakdown with percentage distribution
- Visual progress bars for each emotion
- Total readings counter
- 7-day mood history timeline
- Persistent mood data using localStorage

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Emotion Detection**: face-api.js (TinyFaceDetector + FaceExpressionNet)
- **Storage**: localStorage for both cart and mood data
- **Design**: Responsive CSS Grid and Flexbox
- **Images**: Unsplash API for product images

## Installation

### Prerequisites
- Modern web browser with webcam support
- Camera permissions for emotion tracking
- Node.js (optional, for local server)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd shopping
```

2. Install dependencies (optional):
```bash
npm install
```

3. Start a local server:

**Option 1: Using npm**
```bash
npm start
```
This will start a server on http://localhost:8080

**Option 2: Using Python**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Option 3: Using VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

### Starting Emotion Tracking

1. Navigate to the "Mood Tracker" section
2. Click the "Start Camera" button
3. Grant camera permissions when prompted
4. Wait for the face detection models to load (first time only)
5. Position your face within the camera view
6. The system will automatically detect and record your emotions every 3 seconds

### Shopping

1. Browse products in the "Shop Our Products" section
2. Click "Add to Cart" on any product
3. Click the "Cart" button in the navigation to view your cart
4. Adjust quantities using the +/- buttons
5. Remove items if needed
6. Click "Checkout" to complete your purchase

### Viewing Mood Data

- **Current Emotion**: Displays your real-time emotion with confidence level
- **Today's Mood Summary**: Shows dominant emotion and total readings
- **Emotion Breakdown**: Visual bars showing percentage of each emotion
- **Mood History**: 7-day timeline of your dominant daily moods

## Project Structure

```
shopping/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling
├── js/
│   ├── app.js             # Main application logic
│   ├── emotion-detector.js # Facial emotion detection
│   ├── mood-tracker.js    # Mood data management
│   └── shop.js            # Shopping cart functionality
├── package.json           # Project dependencies
└── README.md             # This file
```

## How It Works

### Emotion Detection Pipeline

1. **Model Loading**: Downloads TinyFaceDetector and FaceExpressionNet models from CDN
2. **Video Stream**: Captures webcam feed using getUserMedia API
3. **Face Detection**: Identifies faces in the video stream
4. **Expression Analysis**: Analyzes facial expressions to determine emotions
5. **Data Storage**: Saves emotion data with timestamps to localStorage
6. **Dashboard Update**: Updates UI with current emotion and statistics

### Data Storage

All data is stored locally in the browser using localStorage:

- **Cart Data**: `moodShop_cart`
  - Product IDs, quantities, and details

- **Mood Data**: `moodShop_moodData`
  - Organized by date (YYYY-MM-DD)
  - Each entry contains:
    - Emotion name
    - Confidence level
    - Timestamp
    - All expression scores

## Browser Compatibility

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 11+
- Edge 79+

**Note**: Requires camera access and JavaScript enabled

## Privacy & Security

- All data is stored locally in your browser
- No data is sent to external servers
- Camera feed is processed entirely client-side
- Clear your browser data to remove all stored information

## Troubleshooting

### Camera Not Working

1. Check browser permissions for camera access
2. Ensure no other application is using the camera
3. Try a different browser
4. Make sure you're accessing via HTTPS or localhost

### Models Not Loading

1. Check your internet connection
2. Clear browser cache
3. Try a different CDN mirror
4. Check browser console for errors

### Emotions Not Detected

1. Ensure adequate lighting
2. Face the camera directly
3. Remove any obstructions (masks, sunglasses)
4. Move closer to the camera
5. Wait a few seconds for detection to stabilize

## Future Enhancements

- User authentication and cloud storage
- Mood-based product recommendations
- Export mood data as CSV/JSON
- More detailed emotion analytics
- Social sharing features
- Multiple language support
- Dark mode toggle

## License

MIT License - feel free to use this project for learning and development purposes.

## Credits

- Face detection powered by [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- Product images from [Unsplash](https://unsplash.com)

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Made with emotion tracking technology
