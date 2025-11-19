// Shopping cart functionality
let cart = [];

// Initialize the products page
document.addEventListener('DOMContentLoaded', () => {
    initializeProductsPage();
});

function initializeProductsPage() {
    initializeAddButtons();
    updateCartButtonWithBadge();
    initializeScrollDown();
    initializeProductCardHovers();
    initializeEmojiCartListener();
}

// Listen for emoji add to cart events from camera
function initializeEmojiCartListener() {
    window.addEventListener('addEmojiToCart', (event) => {
        const { productIndex } = event.detail;
        addToCart(productIndex);

        // Pulse the cart button to draw attention
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.classList.add('pulse');
            setTimeout(() => {
                cartButton.classList.remove('pulse');
            }, 600);
        }
    });
}

// Add button functionality
function initializeAddButtons() {
    const addButtons = document.querySelectorAll('.add-button');

    addButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(index);
            animateAddButton(button);
        });
    });
}

// Add item to cart
function addToCart(productIndex) {
    const productCard = document.querySelectorAll('.product-card')[productIndex];
    const emoji = productCard.querySelector('.emoji').className;
    const tags = Array.from(productCard.querySelectorAll('.tag')).map(tag => tag.textContent);
    const description = productCard.querySelector('.description').textContent;

    const product = {
        id: productIndex,
        emoji: emoji,
        tags: tags,
        description: description,
        quantity: 1
    };

    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === productIndex);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    updateCartDisplay();
    showProductNotification('Added to cart!');
}

// Animate add button
function animateAddButton(button) {
    button.style.transform = 'rotate(90deg) scale(1.2)';
    button.style.backgroundColor = '#8B3A37';

    setTimeout(() => {
        button.style.transform = '';
        button.style.backgroundColor = '';
    }, 300);
}

// Update cart display
function updateCartDisplay() {
    const cartBadge = document.querySelector('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Update cart button to show cart modal
function updateCartButtonWithBadge() {
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        // Remove existing click listeners by cloning
        const newCartButton = cartButton.cloneNode(true);
        cartButton.parentNode.replaceChild(newCartButton, cartButton);

        newCartButton.addEventListener('click', () => {
            if (cart.length > 0) {
                showCartModal();
            } else {
                showProductNotification('Your cart is empty');
            }
        });
    }
}

// Show cart modal
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Your Cart</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-emoji">${getEmojiDisplay(item.emoji)}</span>
                            <div class="cart-item-details">
                                <div class="cart-item-tags">
                                    ${item.tags.map(tag => `<span class="mini-tag">${tag}</span>`).join('')}
                                </div>
                                <p class="cart-item-desc">${item.description.substring(0, 50)}...</p>
                            </div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `).join('')}
            </div>
            <div class="modal-footer">
                <button class="checkout-btn">Checkout (${cart.length} items)</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Checkout button
    modal.querySelector('.checkout-btn').addEventListener('click', () => {
        modal.remove();
        showEmotionalReceipt();
    });

    // Add styles for modal
    addModalStyles();
}

// Get emoji display
function getEmojiDisplay(emojiClass) {
    const emojiMap = {
        'emoji happy-emoji': '😊',
        'emoji wink-emoji': '😉',
        'emoji surprised-emoji': '😮',
        'emoji sad-emoji': '☹️',
        'emoji very-sad-emoji': '😢',
        'emoji crying-emoji': '😭',
        'emoji angry-emoji': '😠',
        'emoji very-angry-emoji': '😡',
        'emoji nervous-emoji': '😬',
        'emoji worried-emoji': '😟',
        'emoji neutral-emoji': '😐',
        'emoji smirk-emoji': '😏'
    };

    return emojiMap[emojiClass] || '😊';
}

// Change quantity
window.changeQuantity = function(productId, change) {
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            // Refresh modal
            document.querySelector('.cart-modal').remove();
            showCartModal();
        }
    }
};

// Remove from cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();

    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
        if (cart.length > 0) {
            showCartModal();
        } else {
            showProductNotification('Cart is now empty');
        }
    }
};

// Show notification
function showProductNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);

    // Add notification styles
    addNotificationStyles();
}

// Scroll down animation
function initializeScrollDown() {
    const scrollDown = document.querySelector('.double-down');

    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// Add modal styles dynamically
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .cart-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background-color: #F5F1E8;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            padding: 30px;
            background-color: #C5504B;
            color: #F5F1E8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-family: 'Bagel Fat One', cursive;
            font-size: 32px;
        }

        .modal-header .close-modal {
            background: none;
            border: none;
            color: #F5F1E8;
            font-size: 40px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .modal-header .close-modal:hover {
            transform: scale(1.2);
        }

        .modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .cart-item {
            background-color: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }

        .cart-item-info {
            display: flex;
            gap: 15px;
            flex: 1;
        }

        .cart-item-emoji {
            font-size: 40px;
        }

        .cart-item-details {
            flex: 1;
        }

        .cart-item-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        }

        .mini-tag {
            background-color: #C5504B;
            color: #F5F1E8;
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 15px;
            font-family: 'Fuzzy Bubbles', cursive;
        }

        .cart-item-desc {
            color: #666;
            font-size: 14px;
            margin: 0;
        }

        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .qty-btn {
            width: 30px;
            height: 30px;
            border: 2px solid #C5504B;
            background-color: white;
            color: #C5504B;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .qty-btn:hover {
            background-color: #C5504B;
            color: white;
        }

        .remove-btn {
            background-color: #C5504B;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
        }

        .remove-btn:hover {
            background-color: #A84440;
        }

        .modal-footer {
            padding: 20px 30px;
            background-color: white;
            border-top: 2px solid #C5504B;
        }

        .checkout-btn {
            width: 100%;
            padding: 15px;
            background-color: #C5504B;
            color: #F5F1E8;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            font-family: 'Fuzzy Bubbles', cursive;
            cursor: pointer;
            transition: all 0.3s;
        }

        .checkout-btn:hover {
            background-color: #A84440;
            transform: scale(1.02);
        }
    `;

    document.head.appendChild(style);
}

// Add notification styles
function addNotificationStyles() {
    if (document.getElementById('product-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'product-notification-styles';
    style.textContent = `
        .product-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #C5504B;
            color: #F5F1E8;
            padding: 15px 30px;
            border-radius: 30px;
            font-family: 'Fuzzy Bubbles', cursive;
            font-size: 18px;
            z-index: 3000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s;
            box-shadow: 0 4px 20px rgba(197, 80, 75, 0.4);
        }

        .product-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;

    document.head.appendChild(style);
}

// Product card hover effect
function initializeProductCardHovers() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const emoji = card.querySelector('.emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1.1) rotate(5deg)';
                emoji.style.transition = 'transform 0.3s';
            }
        });

        card.addEventListener('mouseleave', () => {
            const emoji = card.querySelector('.emoji');
            if (emoji) {
                emoji.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Analyze emotions from cart
function analyzeEmotions() {
    const allTags = cart.flatMap(item => item.tags);
    const uniqueTags = [...new Set(allTags)];

    // Categorize emotions
    const positive = ['Joyful', 'Excited', 'Content', 'Peaceful', 'Playful', 'Cheeky', 'Blissful', 'Starstruck'];
    const negative = ['Sad', 'Worried', 'Anxious', 'Disappointed', 'Doubtful'];
    const neutral = ['Neutral', 'Indifferent', 'Skeptical', 'Tired', 'Sleepy'];
    const energetic = ['Surprised', 'Amazed', 'Excited', 'Starstruck'];

    const emotionCounts = {
        positive: uniqueTags.filter(tag => positive.includes(tag)).length,
        negative: uniqueTags.filter(tag => negative.includes(tag)).length,
        neutral: uniqueTags.filter(tag => neutral.includes(tag)).length,
        energetic: uniqueTags.filter(tag => energetic.includes(tag)).length
    };

    // Generate summary based on emotion mix
    let summary = '';
    const total = emotionCounts.positive + emotionCounts.negative + emotionCounts.neutral;

    if (emotionCounts.positive > emotionCounts.negative && emotionCounts.positive > emotionCounts.neutral) {
        summary = "You're experiencing a predominantly positive emotional state today! Your feelings show an optimistic outlook with moments of joy and contentment. Embrace this energy and share it with others around you.";
    } else if (emotionCounts.negative > emotionCounts.positive) {
        if (emotionCounts.positive > 0) {
            summary = "You're navigating through some challenging emotions today, but there's also brightness mixed in. It's okay to feel complex emotions - they're all valid. Take time for self-care and remember that difficult feelings are temporary.";
        } else {
            summary = "Today feels heavy with difficult emotions. Remember that it's completely normal to have tough days. Be gentle with yourself, reach out to loved ones if you need support, and know that brighter days are ahead.";
        }
    } else if (emotionCounts.neutral > 0 && emotionCounts.positive === 0 && emotionCounts.negative === 0) {
        summary = "You're in a calm, neutral emotional space today. This balanced state can be peaceful and grounding. It's a great time for reflection and mindful activities.";
    } else {
        summary = "Your emotions today are beautifully complex and multifaceted. You're experiencing a rich mix of feelings - joy alongside worry, excitement with caution. This emotional diversity shows your depth and humanity. Honor all these feelings as they come.";
    }

    // Add specific observations
    if (emotionCounts.energetic > 2) {
        summary += " There's a strong energetic current running through your emotional state - channel this into creative or active pursuits!";
    }

    if (uniqueTags.includes('Tired') || uniqueTags.includes('Sleepy')) {
        summary += " Your body and mind may need extra rest today. Listen to these signals and give yourself permission to slow down.";
    }

    return {
        tags: uniqueTags,
        summary: summary,
        counts: emotionCounts
    };
}

// Show emotional receipt
function showEmotionalReceipt() {
    const analysis = analyzeEmotions();
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const receipt = document.createElement('div');
    receipt.className = 'emotional-receipt-modal';
    receipt.innerHTML = `
        <div class="receipt-content">
            <div class="receipt-header">
                <h2>Your Emotional Receipt</h2>
                <button class="close-receipt">&times;</button>
            </div>
            <div class="receipt-body">
                <div class="receipt-date">
                    <p class="date-label">Checked Out:</p>
                    <p class="date-value">${dateString}</p>
                    <p class="time-value">${timeString}</p>
                </div>

                <div class="receipt-divider"></div>

                <div class="receipt-emotions">
                    <h3>Today's Emotions</h3>
                    <div class="emotion-tags-display">
                        ${analysis.tags.map(tag => `<span class="receipt-tag">${tag}</span>`).join('')}
                    </div>
                </div>

                <div class="receipt-items">
                    <h3>Items Selected (${cart.length})</h3>
                    ${cart.map(item => `
                        <div class="receipt-item">
                            <div class="receipt-item-emoji">${getEmojiDisplay(item.emoji)}</div>
                            <div class="receipt-item-info">
                                <div class="receipt-item-tags">
                                    ${item.tags.map(tag => `<span class="receipt-mini-tag">${tag}</span>`).join('')}
                                </div>
                                ${item.quantity > 1 ? `<span class="receipt-qty">x${item.quantity}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="receipt-divider"></div>

                <div class="receipt-analysis">
                    <h3>Your Emotional Summary</h3>
                    <p class="analysis-text">${analysis.summary}</p>
                </div>

                <div class="receipt-divider"></div>

                <div class="receipt-actions">
                    <button class="save-calendar-btn" onclick="saveToCalendar()">
                        📅 Save to Calendar
                    </button>
                    <p class="receipt-note">Remember: All emotions are valid. Take care of yourself today. 💚</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(receipt);

    // Close receipt functionality
    receipt.querySelector('.close-receipt').addEventListener('click', () => {
        receipt.remove();
        cart = []; // Clear cart after viewing receipt
        updateCartDisplay();
    });

    receipt.addEventListener('click', (e) => {
        if (e.target === receipt) {
            receipt.remove();
            cart = [];
            updateCartDisplay();
        }
    });

    // Add receipt styles
    addReceiptStyles();
}

// Save to calendar (.ics file)
window.saveToCalendar = function() {
    const analysis = analyzeEmotions();
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0].replace(/-/g, '');

    const emotionsList = analysis.tags.join(', ');
    const cartSummary = cart.map((item, index) => `${index + 1}. ${item.tags.join(' & ')} (x${item.quantity})`).join('\\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shop Your Emotions//Emotional Receipt//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART;VALUE=DATE:${todayFormatted}
DTEND;VALUE=DATE:${todayFormatted}
SUMMARY:Emotional Check-In: ${analysis.tags.slice(0, 3).join(', ')}
DESCRIPTION:${analysis.summary.replace(/\n/g, '\\n')}\\n\\nEmotions: ${emotionsList}\\n\\nItems Selected:\\n${cartSummary}
LOCATION:Shop Your Emotions
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reflect on your emotions from today
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Create download link
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `emotional-receipt-${todayFormatted}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showProductNotification('Calendar event saved! 📅');
};

// Add receipt styles
function addReceiptStyles() {
    if (document.getElementById('receipt-styles')) return;

    const style = document.createElement('style');
    style.id = 'receipt-styles';
    style.textContent = `
        .emotional-receipt-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2500;
            animation: fadeIn 0.3s;
            overflow-y: auto;
            padding: 20px;
        }

        .receipt-content {
            background-color: #F5F1E8;
            border-radius: 20px;
            width: 100%;
            max-width: 650px;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.4s;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .receipt-header {
            padding: 30px;
            background-color: #C5504B;
            color: #F5F1E8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .receipt-header h2 {
            margin: 0;
            font-family: 'Bagel Fat One', cursive;
            font-size: 32px;
        }

        .close-receipt {
            background: none;
            border: none;
            color: #F5F1E8;
            font-size: 40px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            transition: transform 0.2s;
        }

        .close-receipt:hover {
            transform: scale(1.2) rotate(90deg);
        }

        .receipt-body {
            padding: 30px;
            overflow-y: auto;
            flex: 1;
        }

        .receipt-date {
            text-align: center;
            margin-bottom: 25px;
        }

        .date-label {
            font-family: 'Fuzzy Bubbles', cursive;
            font-size: 16px;
            color: #C5504B;
            margin: 0 0 8px 0;
        }

        .date-value {
            font-family: 'Bagel Fat One', cursive;
            font-size: 20px;
            color: #C5504B;
            margin: 0;
        }

        .time-value {
            font-size: 16px;
            color: #666;
            margin: 5px 0 0 0;
        }

        .receipt-divider {
            height: 2px;
            background: repeating-linear-gradient(
                to right,
                #C5504B 0px,
                #C5504B 10px,
                transparent 10px,
                transparent 20px
            );
            margin: 25px 0;
        }

        .receipt-emotions h3,
        .receipt-items h3,
        .receipt-analysis h3 {
            font-family: 'Bagel Fat One', cursive;
            font-size: 22px;
            color: #C5504B;
            margin: 0 0 15px 0;
        }

        .emotion-tags-display {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }

        .receipt-tag {
            background-color: #C5504B;
            color: #F5F1E8;
            font-family: 'Fuzzy Bubbles', cursive;
            font-size: 18px;
            padding: 10px 20px;
            border-radius: 25px;
            white-space: nowrap;
        }

        .receipt-item {
            background-color: white;
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .receipt-item-emoji {
            font-size: 36px;
        }

        .receipt-item-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .receipt-item-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .receipt-mini-tag {
            background-color: #C5504B;
            color: #F5F1E8;
            font-size: 14px;
            padding: 6px 14px;
            border-radius: 15px;
            font-family: 'Fuzzy Bubbles', cursive;
        }

        .receipt-qty {
            font-size: 14px;
            color: #666;
            font-weight: bold;
        }

        .analysis-text {
            background-color: white;
            padding: 20px;
            border-radius: 15px;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin: 0;
        }

        .receipt-actions {
            text-align: center;
        }

        .save-calendar-btn {
            width: 100%;
            padding: 18px;
            background-color: #C5504B;
            color: #F5F1E8;
            border: none;
            border-radius: 30px;
            font-size: 20px;
            font-family: 'Fuzzy Bubbles', cursive;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 15px;
        }

        .save-calendar-btn:hover {
            background-color: #A84440;
            transform: scale(1.02);
        }

        .receipt-note {
            font-size: 14px;
            color: #666;
            margin: 0;
            font-style: italic;
        }

        @media (max-width: 600px) {
            .receipt-content {
                max-width: 100%;
                max-height: 95vh;
            }

            .receipt-header h2 {
                font-size: 24px;
            }

            .receipt-body {
                padding: 20px;
            }

            .receipt-tag {
                font-size: 16px;
                padding: 8px 16px;
            }
        }
    `;

    document.head.appendChild(style);
}

// Console welcome message for products
console.log('%cShop Your Emotions - Products Page 🛍️', 'font-size: 18px; color: #C5504B; font-weight: bold;');
