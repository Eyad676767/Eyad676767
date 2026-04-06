// Ecommerce Global State - CoolMart AC Store Masterpiece
const storeState = {
    products: [
        {
            id: 1,
            name: 'ProCool Elite 18K BTU',
            category: 'split',
            price: 899,
            originalPrice: 1199,
            image: 'procool.jpg',
            rating: 4.9,
            reviews: 1278,
            features: ['WiFi Smart', 'Inverter Tech', 'Gold Fin Coils', '19dB Whisper Quiet'],
            bestseller: true,
            stock: 47
        },
        {
            id: 2,
            name: 'EcoFrost Window 12K',
            category: 'window',
            price: 399,
            originalPrice: 499,
            image: 'ecofrost.jpg',
            rating: 4.7,
            reviews: 892,
            features: ['Energy Star', 'Easy Install', 'Remote Control', '3-Year Warranty'],
            bestseller: true,
            stock: 124
        },
        {
            id: 3,
            name: 'IceMax Portable 14K',
            category: 'portable',
            price: 549,
            originalPrice: 649,
            image: 'icemax.jpg',
            rating: 4.8,
            reviews: 634,
            features: ['True Portable', 'Dual Hose', 'Dehumidify', '24Hr Timer'],
            stock: 89
        },
        {
            id: 4,
            name: 'SmartWave Smart 24K',
            category: 'smart',
            price: 1299,
            originalPrice: 1599,
            image: 'smartwave.jpg',
            rating: 4.95,
            reviews: 456,
            features: ['Voice Control', 'AI Learning', 'Air Quality', 'App Integration'],
            stock: 23
        }
        // 16+ more premium models...
    ],
    cart: JSON.parse(localStorage.getItem('coolmart_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('coolmart_wishlist')) || [],
    checkout: {
        step: 1,
        shipping: 'standard',
        payment: 'card'
    }
};

// Initialize Ecommerce
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    setupCartListeners();
    updateCartDisplay();
    setupAddToCartButtons();
    updateNavCartCount();
});

// Add to Cart - Core Functionality
function addToCart(productId, quantity = 1) {
    const product = storeState.products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = storeState.cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        storeState.cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCart();
    updateCartDisplay();
    showAddFeedback(product.name);
}

// Remove from Cart
function removeFromCart(productId) {
    storeState.cart = storeState.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update Cart Quantity
function updateCartQuantity(productId, newQty) {
    const item = storeState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQty);
        saveCart();
        updateCartDisplay();
    }
}

// Cart Totals Calculation
function getCartTotals() {
    const subtotal = storeState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    return { subtotal, discount, total, items: storeState.cart.length };
}

// Update Cart Display (energy.html cart page)
function updateCartDisplay() {
    const { subtotal, discount, total } = getCartTotals();
    
    document.getElementById('cart-subtotal') && (document.getElementById('cart-subtotal').textContent = `$${subtotal.toLocaleString()}`);
    document.getElementById('cart-total') && (document.getElementById('cart-total').textContent = `$${total.toLocaleString()}`);
    document.getElementById('grand-total') && (document.getElementById('grand-total').textContent = `$${total.toLocaleString()}`);

    // Update cart count in nav
    updateNavCartCount();
}

// Save/Load Cart Persistence
function saveCart() {
    localStorage.setItem('coolmart_cart', JSON.stringify(storeState.cart));
}

function loadCart() {
    const saved = localStorage.getItem('coolmart_cart');
    if (saved) storeState.cart = JSON.parse(saved);
}

// Setup Add to Cart Buttons (across all product pages) - Enhanced for all variants
function setupAddToCartButtons() {
    // Standard add to cart
    document.querySelectorAll('.add-to-cart-btn, .ghost-btn[data-action="add"], .outline-btn[data-action="add"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId) || 1;
            addToCart(productId);
            this.textContent = 'Added! ✓';
            this.style.background = '#00ff88';
            setTimeout(() => {
                this.textContent = this.dataset.originalText || 'Add to Cart';
                this.style.background = '';
            }, 1500);
        });
    });
    
    // Quick add for related products
    document.querySelectorAll('[data-action="quick-add"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId) || 2; // Default related
            addToCart(productId, 1);
        });
    });
}

// Setup Cart Page Listeners (energy.html)
function setupCartListeners() {
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const container = this.closest('.quantity-control');
            const qtySpan = container.querySelector('.qty');
            const productId = parseInt(container.dataset.productId) || 1;
            let qty = parseInt(qtySpan.textContent);
            
            if (this.textContent === '-') {
                qty = Math.max(1, qty - 1);
            } else {
                qty += 1;
            }
            
            updateCartQuantity(productId, qty);
            qtySpan.textContent = qty;
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.productId) || 1;
            removeFromCart(productId);
            this.closest('.cart-item').remove();
        });
    });

    // Checkout button
    document.querySelector('.proceed-checkout')?.addEventListener('click', () => {
        window.location.href = 'settings.html';
    });
}

// Nav Cart Count
function updateNavCartCount() {
    const cartCount = document.querySelector('.cart-count') || createCartIndicator();
    cartCount.textContent = storeState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Create Cart Indicator (dynamic)
function createCartIndicator() {
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = '🛒 <span class="cart-count">0</span>';
    document.querySelector('.nav-container').appendChild(cartIcon);
    return cartIcon.querySelector('.cart-count');
}

// Add to Cart Feedback Animation
function showAddFeedback(productName) {
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'add-toast';
    toast.textContent = `${productName} added to cart! 🎉`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Export for page-specific scripts
window.storeState = storeState;
window.addToCart = addToCart;
window.getCartTotals = getCartTotals;
window.updateCartDisplay = updateCartDisplay;
