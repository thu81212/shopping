// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const detectButton = document.querySelector('.detect-button');
    const cartButton = document.querySelector('.cart-button');
    const doubleDown = document.querySelector('.double-down');
    
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
    
    // Function to handle emotion detection
    function handleEmotionDetection() {
        // Check if browser supports camera access
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showNotification('Camera access is not supported in your browser', 'error');
            return;
        }
        
        // Request camera permission
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Camera access granted
                showNotification('Camera access granted!', 'success');
                
                // In a real app, you would:
                // 1. Show camera preview
                // 2. Capture image
                // 3. Send to emotion detection API
                // 4. Show results
                
                // For demo, we'll just show a message
                setTimeout(() => {
                    showNotification('Analyzing your emotion...', 'info');
                    
                    // Simulate emotion detection
                    setTimeout(() => {
                        const emotions = ['Happy', 'Calm', 'Excited', 'Relaxed', 'Content'];
                        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
                        showNotification(`You seem ${randomEmotion}! Here are products for you.`, 'success');
                    }, 2000);
                }, 1000);
                
                // Stop the camera
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(function(error) {
                console.error('Camera error:', error);
                
                if (error.name === 'NotAllowedError') {
                    showNotification('Please allow camera access to detect emotions', 'error');
                } else if (error.name === 'NotFoundError') {
                    showNotification('No camera found on your device', 'error');
                } else {
                    showNotification('Error accessing camera: ' + error.message, 'error');
                }
            });
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
    
    // Add CSS animations
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideUp {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
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
            ellipse.style.transform = `translateY(${yPos}px) ${ellipse.style.transform.includes('rotate') ? ellipse.style.transform : ''}`;
        });
    }
    
    // Image loading verification
    const allImages = document.querySelectorAll('img');
    let loadedImages = 0;
    let totalImages = allImages.length;
    
    allImages.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', function() {
                loadedImages++;
                checkAllImagesLoaded();
            });
            
            img.addEventListener('error', function() {
                console.error('Failed to load image:', img.src);
                loadedImages++;
                checkAllImagesLoaded();
            });
        }
    });
    
    function checkAllImagesLoaded() {
        if (loadedImages === totalImages) {
            console.log('All images loaded successfully');
        }
    }
    
    // Initial check
    checkAllImagesLoaded();
});
