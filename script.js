// Shopping cart functionality
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeAddButtons();
    initializeCartButton();
    initializeScrollDown();
});

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
    showNotification('Added to cart!');
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
    const cartButton = document.querySelector('.cart-button');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add badge if items in cart
    let badge = cartButton.querySelector('.cart-badge');
    
    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartButton.appendChild(badge);
        }
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else if (badge) {
        badge.style.display = 'none';
    }
}

// Cart button click
function initializeCartButton() {
    const cartButton = document.querySelector('.cart-button');
    
    cartButton.addEventListener('click', () => {
        if (cart.length > 0) {
            showCartModal();
        } else {
            showNotification('Your cart is empty');
        }
    });
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
        showNotification('Checkout coming soon!');
        modal.remove();
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
            showNotification('Cart is now empty');
        }
    }
};

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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
    const scrollDown = document.querySelector('.scroll-down');
    
    scrollDown.addEventListener('click', () => {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
        
        .close-modal {
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
        
        .close-modal:hover {
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
        
        .cart-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #8B3A37;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid #F5F1E8;
        }
    `;
    
    document.head.appendChild(style);
}

// Add notification styles
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
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
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
}

// Product card hover effect
document.addEventListener('DOMContentLoaded', () => {
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
});

// Console welcome message
console.log('%cShop Your Emotions 😊', 'font-size: 24px; color: #C5504B; font-weight: bold;');
console.log('%cBuild with ❤️ using HTML, CSS, and JavaScript', 'font-size: 14px; color: #666;');
