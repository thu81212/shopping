/**
 * Shopping functionality
 * Manages product catalog and shopping cart
 */

class Shop {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'Wireless Headphones',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                description: 'Premium wireless headphones with noise cancellation'
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 299.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                description: 'Feature-rich smartwatch with health tracking'
            },
            {
                id: 3,
                name: 'Laptop Backpack',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
                description: 'Durable backpack with laptop compartment'
            },
            {
                id: 4,
                name: 'Coffee Maker',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
                description: 'Programmable coffee maker with thermal carafe'
            },
            {
                id: 5,
                name: 'Desk Lamp',
                price: 39.99,
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
                description: 'LED desk lamp with adjustable brightness'
            },
            {
                id: 6,
                name: 'Yoga Mat',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
                description: 'Non-slip yoga mat with carrying strap'
            },
            {
                id: 7,
                name: 'Bluetooth Speaker',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
                description: 'Portable waterproof Bluetooth speaker'
            },
            {
                id: 8,
                name: 'Running Shoes',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
                description: 'Comfortable running shoes with great support'
            },
            {
                id: 9,
                name: 'Water Bottle',
                price: 24.99,
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
                description: 'Insulated stainless steel water bottle'
            },
            {
                id: 10,
                name: 'Sunglasses',
                price: 149.99,
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
                description: 'UV protection sunglasses with polarized lenses'
            },
            {
                id: 11,
                name: 'Plant Pot',
                price: 19.99,
                image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
                description: 'Ceramic plant pot with drainage'
            },
            {
                id: 12,
                name: 'Phone Case',
                price: 14.99,
                image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
                description: 'Protective phone case with slim design'
            }
        ];

        this.cart = this.loadCart();
        this.initializeShop();
    }

    /**
     * Initialize shop display
     */
    initializeShop() {
        this.renderProducts();
        this.updateCartCount();
        this.setupCartModal();
    }

    /**
     * Render product grid
     */
    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        grid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-add-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            });
        });
    }

    /**
     * Add product to cart
     */
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showCartNotification(product.name);
    }

    /**
     * Remove product from cart
     */
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    /**
     * Update product quantity in cart
     */
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    /**
     * Calculate cart total
     */
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Get total items in cart
     */
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Update cart count in navbar
     */
    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = this.getCartItemCount();
        }
    }

    /**
     * Setup cart modal
     */
    setupCartModal() {
        const modal = document.getElementById('cart-modal');
        const cartLink = document.querySelector('.cart-link');
        const closeBtn = modal?.querySelector('.close');

        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Checkout button
        const checkoutBtn = modal?.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    /**
     * Open cart modal
     */
    openCart() {
        this.renderCart();
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    /**
     * Render cart items
     */
    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotalElement) {
                cartTotalElement.textContent = '0.00';
            }
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="btn-quantity" data-product-id="${item.id}" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-quantity" data-product-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="btn-remove" data-product-id="${item.id}">Remove</button>
                </div>
                <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Update total
        if (cartTotalElement) {
            cartTotalElement.textContent = this.getCartTotal().toFixed(2);
        }

        // Add event listeners
        document.querySelectorAll('.btn-quantity').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;
                const item = this.cart.find(item => item.id === productId);

                if (item) {
                    if (action === 'increase') {
                        this.updateQuantity(productId, item.quantity + 1);
                    } else if (action === 'decrease') {
                        if (item.quantity > 1) {
                            this.updateQuantity(productId, item.quantity - 1);
                        }
                    }
                }
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.removeFromCart(productId);
            });
        });
    }

    /**
     * Checkout
     */
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.getCartTotal();
        alert(`Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo - no actual payment was processed.`);

        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();

        // Close modal
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Show notification when item added to cart
     */
    showCartNotification(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = `${productName} added to cart!`;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem('moodShop_cart', JSON.stringify(this.cart));
    }

    /**
     * Load cart from localStorage
     */
    loadCart() {
        const saved = localStorage.getItem('moodShop_cart');
        return saved ? JSON.parse(saved) : [];
    }
}
