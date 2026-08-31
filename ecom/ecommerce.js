/* =====================================================
   ShopZone — ecommerce.js
   Cart feature: add, update quantity, remove, total
   ===================================================== */

// ─── State ────────────────────────────────────────────
let products = [];
let cart = [];   // [{ id, title, price, thumbnail, discount, quantity }]

// ─── DOM Refs ────────────────────────────────────────
const productContainer = document.getElementById("products-container");
const productsStatus = document.getElementById("products-status");

// Cart sidebar
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartBadge = document.getElementById("cart-count-badge");
const cartItemCountLabel = document.getElementById("cart-item-count-label");
const cartItemsList = document.getElementById("cart-items-list");
const cartEmptyState = document.getElementById("cart-empty-state");
const cartFooter = document.getElementById("cart-footer");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Toast
const toast = document.getElementById("toast");
let toastTimer = null;

// ─── Toast ───────────────────────────────────────────
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    // Allow display:none removal to paint before adding .show
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add("show"));
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 400);
    }, 2500);
}

// ─── Cart Open / Close ────────────────────────────────
function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.add("hidden");
    document.body.style.overflow = "";
}

cartToggleBtn.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartSidebar.classList.contains("open")) closeCart();
});

// ─── Cart State Helpers ───────────────────────────────
function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalPrice() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartItem(id) {
    return cart.find(item => item.id === id);
}

// ─── Cart: Add / Update ───────────────────────────────
function addToCart(product, qty = 1) {
    const existing = getCartItem(product.id);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            discount: product.discountPercentage || 0,
            quantity: qty,
        });
    }
    renderCart();
    updateProductQtyDisplay(product.id);
    showToast(`🛒 "${product.title.slice(0, 30)}…" added to cart`);

    // Badge bounce animation replay
    cartBadge.classList.remove("hidden");
    cartBadge.style.animation = "none";
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cartBadge.style.animation = "";
        });
    });
}

function changeCartQty(id, delta) {
    const item = getCartItem(id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    renderCart();
    updateProductQtyDisplay(id);
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
    updateProductQtyDisplay(id);
    showToast("🗑️ Item removed from cart");
}

function clearCart() {
    cart = [];
    renderCart();
    // Reset all product qty displays
    document.querySelectorAll(".qty-display").forEach(el => { el.textContent = "0"; });
}

// ─── Sync product card qty display with cart ─────────
function updateProductQtyDisplay(productId) {
    const item = getCartItem(productId);
    const qtyEl = document.getElementById(`qty-display-${productId}`);
    if (qtyEl) qtyEl.textContent = item ? item.quantity : "0";
}

// ─── Render Cart Sidebar ──────────────────────────────
function renderCart() {
    const total = getTotalItems();
    const totalPrice = getTotalPrice();

    // Update badge
    if (total === 0) {
        cartBadge.classList.add("hidden");
    } else {
        cartBadge.classList.remove("hidden");
        cartBadge.textContent = total > 99 ? "99+" : total;
    }

    // Item count label
    cartItemCountLabel.textContent = `${total} ${total === 1 ? "item" : "items"}`;

    if (cart.length === 0) {
        cartEmptyState.classList.remove("hidden");
        cartItemsList.classList.add("hidden");
        cartFooter.classList.add("hidden");
        return;
    }

    cartEmptyState.classList.add("hidden");
    cartItemsList.classList.remove("hidden");
    cartFooter.classList.remove("hidden");

    // Update totals
    cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    // Build cart item rows
    cartItemsList.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.id = `cart-row-${item.id}`;

        row.innerHTML = `
            <img class="cart-item-img" src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            <div class="cart-item-details">
                <div class="cart-item-name" title="${item.title}">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn" id="cart-dec-${item.id}" aria-label="Decrease quantity">−</button>
                    <span class="cart-qty-value" id="cart-qty-val-${item.id}">${item.quantity}</span>
                    <button class="cart-qty-btn" id="cart-inc-${item.id}" aria-label="Increase quantity">+</button>
                    <button class="remove-item-btn" id="cart-remove-${item.id}" aria-label="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        `;

        cartItemsList.appendChild(row);

        // Attach events
        document.getElementById(`cart-inc-${item.id}`).addEventListener("click", () => changeCartQty(item.id, 1));
        document.getElementById(`cart-dec-${item.id}`).addEventListener("click", () => changeCartQty(item.id, -1));
        document.getElementById(`cart-remove-${item.id}`).addEventListener("click", () => removeFromCart(item.id));
    });
}

// ─── Checkout & Clear ─────────────────────────────────
checkoutBtn.addEventListener("click", () => {
    showToast("✅ Order placed! Thank you for shopping with us.");
    clearCart();
    closeCart();
});

clearCartBtn.addEventListener("click", () => {
    if (cart.length > 0) {
        clearCart();
        showToast("🗑️ Cart cleared");
    }
});

// ─── Render Products ──────────────────────────────────
function renderProducts() {
    productContainer.innerHTML = "";

    products.forEach((product, index) => {
        const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

        const card = document.createElement("div");
        card.className = "product-card";
        card.style.animationDelay = `${index * 30}ms`;

        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                <span class="product-category-badge">${product.category}</span>
                <span class="product-rating-badge">⭐ ${product.rating}</span>
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-original-price">$${originalPrice}</span>
                    <span class="product-discount">-${Math.round(product.discountPercentage)}%</span>
                </div>
                <div class="qty-and-cart">
                    <div class="qty-controls">
                        <button class="qty-btn" id="dec-${product.id}" aria-label="Decrease">−</button>
                        <span class="qty-display" id="qty-display-${product.id}">0</span>
                        <button class="qty-btn" id="inc-${product.id}" aria-label="Increase">+</button>
                    </div>
                    <button class="add-to-cart-btn" id="atc-${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        productContainer.appendChild(card);

        // Local quantity counter (for the card, independent of cart)
        let localQty = 0;
        const decBtn = document.getElementById(`dec-${product.id}`);
        const incBtn = document.getElementById(`inc-${product.id}`);
        const qtyDisp = document.getElementById(`qty-display-${product.id}`);
        const atcBtn = document.getElementById(`atc-${product.id}`);

        incBtn.addEventListener("click", () => {
            localQty++;
            qtyDisp.textContent = localQty;
        });

        decBtn.addEventListener("click", () => {
            if (localQty > 0) localQty--;
            qtyDisp.textContent = localQty;
        });

        atcBtn.addEventListener("click", () => {
            const qty = localQty > 0 ? localQty : 1;
            addToCart(product, qty);
            // Reset local qty
            localQty = 0;
            qtyDisp.textContent = "0";
            // Reflect cart qty after adding
            updateProductQtyDisplay(product.id);
        });
    });
}

// ─── Fetch Products ───────────────────────────────────
const getProductsData = async () => {
    productsStatus.innerHTML = `<span class="spinner"></span>Loading 30 products…`;

    try {
        const response = await fetch("https://dummyjson.com/products?limit=30");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        products = data.products;

        productsStatus.textContent = `${products.length} products found`;

        renderProducts();
        renderCart();
    } catch (err) {
        productsStatus.textContent = "⚠️ Failed to load products. Check your connection.";
        console.error("Fetch error:", err);
    }
};

// ─── Init ─────────────────────────────────────────────
getProductsData();