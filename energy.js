// Shopping Cart Page Functionality - Fully Working Cart
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupCartControls();
    setupCheckoutButton();
});

// Update Cart Display with Real Data
function updateCartDisplay() {
    const totals = getCartTotals();
    const cartContainer = document.querySelector('.cart-items');
    
    if (storeState.cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #b0b0b0; padding: 3rem;">Your cart is empty. <a href="control.html">Continue shopping</a></p>';
        return;
    }
    
    // Render cart items
    cartContainer.innerHTML = storeState.cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image" style="background: linear-gradient(135deg, ${getGradient(item.category)}"></div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.features.join(' • ')}</p>
                <div class="quantity-control" data-product-id="${item.id}">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toLocaleString()}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');

    // Update totals
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total') || document.getElementById('grand-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${(totals.subtotal).toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${(totals.total).toLocaleString()}`;
    
    updateNavCartCount();
}

// Cart Controls
function setupCartControls() {
    // Quantity change (delegated)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const container = e.target.closest('.quantity-control');
            const productId = parseInt(container.dataset.productId);
            const delta = e.target.textContent === '-' ? -1 : 1;
            changeQty(productId, delta);
        }
    });
}

// Change Quantity
function changeQty(productId, delta) {
    const item = storeState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        if (item.quantity === 0) removeFromCart(productId);
        else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Checkout Button
function setupCheckoutButton() {
    document.querySelector('.proceed-checkout')?.addEventListener('click', function() {
        if (storeState.cart.length > 0) {
            window.location.href = 'settings.html';
        }
    });
}

// Gradient Helper for Categories
function getGradient(category) {
    const gradients = {
        split: '#667eea, #764ba2',
        window: '#f093fb, #f5576c',
        portable: '#4facfe, #00f2fe',
        smart: '#43e97b, #38f9d7'
    };
    return gradients[category] || '#667eea, #764ba2';
}

// Export Global Functions
window.getCartTotals = getCartTotals;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.updateCartDisplay = updateCartDisplay;
window.storeState = storeState;
