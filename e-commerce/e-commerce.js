// ==================== PRODUCT DATABASE ====================
const products = [
    // Smartphones
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "smartphones",
        price: 999,
        originalPrice: 1099,
        rating: 4.8,
        reviews: 245,
        description: "Powerful A17 Pro chip with 120Hz display",
        specs: {
            display: "6.1 inch Super Retina XDR",
            processor: "A17 Pro",
            ram: "8GB",
            storage: "256GB",
            camera: "48MP Main + 12MP Ultra Wide"
        },
        emoji: "📱"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "smartphones",
        price: 899,
        originalPrice: 999,
        rating: 4.7,
        reviews: 189,
        description: "Flagship Android with AI features",
        specs: {
            display: "6.2 inch Dynamic AMOLED",
            processor: "Snapdragon 8 Gen 3",
            ram: "12GB",
            storage: "256GB",
            camera: "50MP Main + 10MP Telephoto"
        },
        emoji: "📱"
    },
    {
        id: 3,
        name: "Google Pixel 8",
        category: "smartphones",
        price: 799,
        originalPrice: 899,
        rating: 4.6,
        reviews: 156,
        description: "Google's AI-powered photography",
        specs: {
            display: "6.3 inch OLED",
            processor: "Google Tensor G3",
            ram: "12GB",
            storage: "256GB",
            camera: "50MP Main + 12MP Ultra Wide"
        },
        emoji: "📱"
    },
    
    // Laptops
    {
        id: 4,
        name: "MacBook Pro 16\"",
        category: "laptops",
        price: 2499,
        originalPrice: 2699,
        rating: 4.9,
        reviews: 312,
        description: "M3 Max chip with stunning Retina display",
        specs: {
            display: "16 inch Liquid Retina XDR",
            processor: "Apple M3 Max",
            ram: "36GB",
            storage: "512GB SSD",
            battery: "Up to 22 hours"
        },
        emoji: "💻"
    },
    {
        id: 5,
        name: "Dell XPS 13",
        category: "laptops",
        price: 1199,
        originalPrice: 1399,
        rating: 4.7,
        reviews: 267,
        description: "Ultra-compact with powerful performance",
        specs: {
            display: "13.4 inch FHD+ Touchscreen",
            processor: "Intel Core Ultra 5",
            ram: "16GB LPDDR5X",
            storage: "512GB SSD",
            battery: "Up to 13 hours"
        },
        emoji: "💻"
    },
    {
        id: 6,
        name: "ASUS ROG Gaming Laptop",
        category: "laptops",
        price: 1899,
        originalPrice: 2099,
        rating: 4.8,
        reviews: 198,
        description: "High-performance gaming powerhouse",
        specs: {
            display: "16 inch 165Hz IPS",
            processor: "Intel Core i9-13th Gen",
            ram: "32GB DDR5",
            storage: "1TB SSD",
            gpu: "NVIDIA RTX 4070"
        },
        emoji: "💻"
    },
    
    // Accessories
    {
        id: 7,
        name: "AirPods Pro Max",
        category: "accessories",
        price: 549,
        originalPrice: 549,
        rating: 4.6,
        reviews: 142,
        description: "Premium spatial audio headphones",
        specs: {
            type: "Over-Ear Headphones",
            audio: "Spatial Audio with dynamic head tracking",
            battery: "Up to 20 hours",
            features: "Active Noise Cancellation, Transparency mode",
            connectivity: "Bluetooth 5.3"
        },
        emoji: "🎧"
    },
    {
        id: 8,
        name: "Sony WH-1000XM5",
        category: "accessories",
        price: 399,
        originalPrice: 449,
        rating: 4.8,
        reviews: 523,
        description: "Industry-leading noise cancellation",
        specs: {
            type: "Over-Ear Headphones",
            audio: "Hi-Res Audio, LDAC support",
            battery: "Up to 12 hours",
            features: "Active Noise Cancellation, Multipoint Connection",
            connectivity: "Bluetooth 5.3"
        },
        emoji: "🎧"
    },
    {
        id: 9,
        name: "Logitech MX Keys",
        category: "accessories",
        price: 99,
        originalPrice: 129,
        rating: 4.7,
        reviews: 401,
        description: "Premium mechanical keyboard for professionals",
        specs: {
            type: "Wireless Keyboard",
            keys: "Backlit Mechanical Keys",
            battery: "Up to 10 days",
            compatibility: "Windows, Mac, Linux, iOS, Android",
            features: "Multi-device pairing"
        },
        emoji: "⌨️"
    },
    
    // Wearables
    {
        id: 10,
        name: "Apple Watch Series 9",
        category: "wearables",
        price: 429,
        originalPrice: 429,
        rating: 4.8,
        reviews: 289,
        description: "Advanced health and fitness tracking",
        specs: {
            display: "1.9 inch LTPO OLED",
            processor: "S9 SiP",
            battery: "Up to 18 hours",
            features: "Always-On display, ECG, Blood Oxygen",
            waterproof: "50m water resistant"
        },
        emoji: "⌚"
    },
    {
        id: 11,
        name: "Samsung Galaxy Watch 6",
        category: "wearables",
        price: 299,
        originalPrice: 349,
        rating: 4.6,
        reviews: 234,
        description: "Stylish smartwatch with Wear OS",
        specs: {
            display: "1.3 inch AMOLED",
            processor: "Snapdragon 4100+",
            battery: "Up to 40 hours",
            features: "Sleep tracking, SpO2 monitoring",
            waterproof: "5 ATM water resistant"
        },
        emoji: "⌚"
    },
    {
        id: 12,
        name: "Fitbit Charge 6",
        category: "wearables",
        price: 159,
        originalPrice: 199,
        rating: 4.5,
        reviews: 156,
        description: "Affordable fitness tracking essentials",
        specs: {
            display: "1.04 inch OLED",
            battery: "Up to 7 days",
            features: "Heart rate tracking, Sleep insights",
            compatibility: "Android, iOS",
            waterproof: "50m water resistant"
        },
        emoji: "⌚"
    }
];

// ==================== STATE MANAGEMENT ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProducts = [...products];
let appliedDiscount = 0;

// ==================== DOM ELEMENTS ====================
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const cartModal = document.getElementById('cartModal');
const wishlistModal = document.getElementById('wishlistModal');
const checkoutModal = document.getElementById('checkoutModal');
const successModal = document.getElementById('successModal');
const productDetailModal = document.getElementById('productDetailModal');
const filterSidebar = document.getElementById('filterSidebar');
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const maxPriceDisplay = document.getElementById('maxPrice');
const categoryFilters = document.querySelectorAll('.category-filter');
const ratingFilters = document.querySelectorAll('.rating-filter');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Cart and Wishlist
    cartBtn.addEventListener('click', openCart);
    wishlistBtn.addEventListener('click', openWishlist);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('closeWishlist').addEventListener('click', closeWishlist);

    // Filters
    categoryFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    ratingFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    priceRange.addEventListener('input', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('filterToggleBtn').addEventListener('click', () => {
        filterSidebar.classList.add('active');
    });
    document.getElementById('closeFilter').addEventListener('click', () => {
        filterSidebar.classList.remove('active');
    });

    // Search and Sort
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
    document.getElementById('closeCheckout').addEventListener('click', closeCheckout);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    document.getElementById('applyPromo').addEventListener('click', applyPromoCode);

    // Success Modal
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        successModal.classList.remove('active');
        closeCart();
    });

    // Product Detail Modal
    document.getElementById('closeProductDetail').addEventListener('click', closeProductDetail);

    // Buttons
    document.getElementById('continueShopping').addEventListener('click', closeCart);
    document.getElementById('shopNowBtn').addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==================== PRODUCT DISPLAY ====================
function displayProducts(productsToDisplay) {
    if (productsToDisplay.length === 0) {
        document.getElementById('noProducts').style.display = 'block';
        productsGrid.innerHTML = '';
        return;
    }

    document.getElementById('noProducts').style.display = 'none';
    productsGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.emoji}
                <button class="wishlist-icon ${wishlist.includes(product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})">
                    <i class='bx ${wishlist.includes(product.id) ? 'bxs-heart' : 'bx-heart'}'></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div>
                        <span class="product-price">$${product.price}</span>
                        <span class="original-price">$${product.originalPrice}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class='bx bx-shopping-bag'></i>
                    </button>
                </div>
                <button class="btn btn-secondary btn-full" style="margin-top: 0.5rem;" 
                        onclick="viewProduct(${product.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = Math.max(1, parseInt(quantity));
        saveCart();
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateCartQuantity(${item.id}, this.value)">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');

        updateCartSummary();
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping - appliedDiscount;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${Math.max(0, total).toFixed(2)}`;

    // Update checkout modal summary
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${Math.max(0, total).toFixed(2)}`;
}

// ==================== WISHLIST FUNCTIONS ====================
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(productId);
        showNotification(`${product.name} added to wishlist!`);
    }

    saveWishlist();
    updateWishlistCount();
    displayProducts(filteredProducts);
    updateWishlistDisplay();
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    document.querySelector('.wishlist-count').textContent = wishlist.length;
}

function updateWishlistDisplay() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistEmpty = document.getElementById('wishlistEmpty');

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '';
        wishlistEmpty.style.display = 'block';
    } else {
        wishlistEmpty.style.display = 'none';
        const wishlistProducts = wishlist.map(id => products.find(p => p.id === id)).filter(p => p);
        
        wishlistItems.innerHTML = wishlistProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.emoji}
                    <button class="wishlist-icon active" 
                            onclick="toggleWishlist(${product.id})">
                        <i class='bx bxs-heart'></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                            <i class='bx bx-shopping-bag'></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ==================== FILTERING ====================
function applyFilters() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(f => f.checked)
        .map(f => f.value);
    
    const selectedRatings = Array.from(ratingFilters)
        .filter(f => f.checked)
        .map(f => parseInt(f.value));
    
    const maxPrice = parseInt(priceRange.value);
    maxPriceDisplay.textContent = `$${maxPrice}`;

    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || 
                            selectedCategories.includes('all') ||
                            selectedCategories.includes(product.category);
        
        const priceMatch = product.price <= maxPrice;
        
        const ratingMatch = selectedRatings.length === 0 || 
                           selectedRatings.some(rating => product.rating >= rating);

        return categoryMatch && priceMatch && ratingMatch;
    });

    displayProducts(filteredProducts);
    filterSidebar.classList.remove('active');
}

function resetFilters() {
    categoryFilters.forEach(f => f.checked = f.value === 'all');
    ratingFilters.forEach(f => f.checked = false);
    priceRange.value = 2000;
    appliedDiscount = 0;
    
    filteredProducts = [...products];
    displayProducts(filteredProducts);
    filterSidebar.classList.remove('active');
}

// ==================== SEARCH ====================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
}

// ==================== SORTING ====================
function handleSort(e) {
    const sortValue = e.target.value;
    let sorted = [...filteredProducts];

    switch(sortValue) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
    }

    displayProducts(sorted);
}

// ==================== PRODUCT DETAILS ====================
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    const content = document.getElementById('productDetailContent');

    content.innerHTML = `
        <div class="product-detail-image">${product.emoji}</div>
        <div class="product-detail-info">
            <div class="product-category">${product.category}</div>
            <h2>${product.name}</h2>
            
            <div class="product-detail-price">$${product.price}</div>
            
            <div class="product-detail-rating">
                <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                <span>${product.rating} out of 5 (${product.reviews} reviews)</span>
            </div>

            <p class="product-detail-description">${product.description}</p>

            <div class="product-specs">
                <h3>Specifications</h3>
                ${Object.entries(product.specs).map(([key, value]) => `
                    <div class="spec">
                        <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <span>${value}</span>
                    </div>
                `).join('')}
            </div>

            <div class="product-detail-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class='bx bx-shopping-bag'></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="toggleWishlist(${product.id})">
                    <i class='bx ${wishlist.includes(product.id) ? 'bxs-heart' : 'bx-heart'}'></i>
                </button>
            </div>
        </div>
    `;

    productDetailModal.classList.add('active');
}

function closeProductDetail() {
    productDetailModal.classList.remove('active');
}

// ==================== MODALS ====================
function openCart() {
    updateCartDisplay();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openWishlist() {
    updateWishlistDisplay();
    wishlistModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    wishlistModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    closeCart();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartSummary();
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== CHECKOUT ====================
function handleCheckout(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipcode: document.getElementById('zipcode').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        orderDate: new Date().toLocaleDateString(),
        orderId: 'TH' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    // Simulate payment processing
    closeCheckout();
    showOrderSuccess(formData);

    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
}

function showOrderSuccess(formData) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping - appliedDiscount;

    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div class="order-detail-row">
            <strong>Order ID:</strong>
            <span>${formData.orderId}</span>
        </div>
        <div class="order-detail-row">
            <strong>Customer:</strong>
            <span>${formData.fullName}</span>
        </div>
        <div class="order-detail-row">
            <strong>Email:</strong>
            <span>${formData.email}</span>
        </div>
        <div class="order-detail-row">
            <strong>Total Amount:</strong>
            <span style="font-weight: 700; color: var(--primary-color);">$${total.toFixed(2)}</span>
        </div>
        <div class="order-detail-row">
            <strong>Delivery Address:</strong>
            <span>${formData.address}, ${formData.city}, ${formData.state} ${formData.zipcode}</span>
        </div>
        <div class="order-detail-row">
            <strong>Expected Delivery:</strong>
            <span>5-7 Business Days</span>
        </div>
    `;

    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==================== PROMO CODE ====================
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.toUpperCase();
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };

    if (promoCodes[promoCode]) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        appliedDiscount = subtotal * promoCodes[promoCode];
        showNotification(`Promo code applied! Save $${appliedDiscount.toFixed(2)}`);
        updateCartSummary();
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
        color: white;
        border-radius: 0.5rem;
        z-index: 300;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow-lg);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== CLOSE MODALS ON ESC ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cartModal.classList.remove('active');
        wishlistModal.classList.remove('active');
        checkoutModal.classList.remove('active');
        productDetailModal.classList.remove('active');
        filterSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ==================== CLICK OUTSIDE TO CLOSE ====================
[cartModal, wishlistModal, checkoutModal, productDetailModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});