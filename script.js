// ----- Products -----
const products = [
    { id: 1, name: "Laptop", price: 999, category: "Electronics", rating: 4.5, description: "Powerful laptop for work and study.", image: "images/lap.jpg" },
    { id: 2, name: "Phone", price: 599, category: "Electronics", rating: 4.2, description: "Smartphone with great camera and battery.", image: "images/ph.jpg" },
    { id: 3, name: "Headphones", price: 199, category: "Accessories", rating: 4.7, description: "Comfortable headphones with clear sound.", image: "images/headphone.jpg" },
    
    { id: 4, name: "Smart Watch", price: 249, category: "Accessories", rating: 4.3, description: "Track fitness and notifications on the go.", image: "images/smartwatch.jpg" },
    { id: 5, name: "Tablet", price: 399, category: "Electronics", rating: 4.1, description: "Portable tablet for media and notes.", image: "images/tablet.jpg" },
    { id: 6, name: "Bluetooth Speaker", price: 149, category: "Accessories", rating: 4.4, description: "Wireless speaker with rich sound.", image: "images/speaker.jpg" }
];


// ----- Cart (with localStorage) -----
let cart = [];

// load cart from localStorage if exists
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
}

// show products (supports filtered list)
function displayProducts(list = products) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = "";
    list.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.category}</p>
    <p class="category-chip">${product.category}</p>

    <p>Price: $${product.price}</p>
    <button onclick="openProductModal(${product.id})">View details</button>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
`;

        productsDiv.appendChild(productDiv);
    });
}

// add item
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const itemInCart = cart.find(item => item.id === id);
    if (itemInCart) {
        itemInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// remove item
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}
function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // if goes below 1, remove it
        cart = cart.filter(i => i.id !== id);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// draw cart
function renderCart() {
    const cartDiv = document.getElementById('cart');
    const cartTotal = document.getElementById('cart-total');
    const dancer = document.getElementById('checkout-dancer');
  const tips = document.getElementById('cart-tips');
    cartDiv.innerHTML = "";
   if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Cart is empty.</p>";
        cartTotal.textContent = "";
        if (tips) tips.style.display = "block";
        if (dancer) dancer.style.display = "none";
        return;
    }

    if (dancer) dancer.style.display = "inline-block";

    let total = 0;
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemDiv.innerHTML = `
    <p>
        ${item.name} - $${item.price} x 
        <button onclick="decreaseQty(${item.id})">-</button>
        ${item.quantity}
        <button onclick="increaseQty(${item.id})">+</button>
        = $${itemTotal}
        <button onclick="removeFromCart(${item.id})">Remove</button>
    </p>
`;

        cartDiv.appendChild(itemDiv);
    });

    cartTotal.textContent = `Total: $${total}`;
}
// ----- Product details modal -----
const productModal = document.getElementById('product-modal');
const pmName = document.getElementById('pm-name');
const pmImage = document.getElementById('pm-image');
const pmCategory = document.getElementById('pm-category');
const pmRating = document.getElementById('pm-rating');
const pmDescription = document.getElementById('pm-description');
const pmPrice = document.getElementById('pm-price');
const pmAddToCart = document.getElementById('pm-add-to-cart');
const pmClose = document.getElementById('pm-close');

let currentProductId = null;

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductId = id;
    pmName.textContent = product.name;
    pmImage.src = product.image;
    pmImage.alt = product.name;
    pmCategory.textContent = `Category: ${product.category}`;
    pmRating.textContent = `Rating: ${product.rating} / 5`;
    pmDescription.textContent = product.description;
    pmPrice.textContent = `Price: $${product.price}`;

    productModal.style.display = 'flex';
}

pmAddToCart.addEventListener('click', function () {
    if (currentProductId != null) {
        addToCart(currentProductId);
    }
    productModal.style.display = 'none';
});

pmClose.addEventListener('click', function () {
    productModal.style.display = 'none';
});

// ----- Search -----
function setupSearch() {
    const searchArea = document.getElementById('search-area');
    searchArea.innerHTML = `
        <input type="text" id="search-input" placeholder="Search products..." />
        <select id="category-filter">
            <option value="all">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
        </select>
        <select id="sort-price">
            <option value="none">Sort by price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
        </select>
    `;

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-price');

    function applyFilters() {
        const term = searchInput.value.toLowerCase();
        const cat = categoryFilter.value;
        const sort = sortSelect.value;

        let list = products.filter(p =>
            p.name.toLowerCase().includes(term) &&
            (cat === "all" || p.category === cat)
        );

        if (sort === "low") {
            list = list.slice().sort((a, b) => a.price - b.price);
        } else if (sort === "high") {
            list = list.slice().sort((a, b) => b.price - a.price);
        }

        displayProducts(list);
    }

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
}


// ----- Checkout + success overlay -----
const checkoutForm = document.getElementById('checkout-form');
const orderMessage = document.getElementById('order-message'); // optional
const successOverlay = document.getElementById('success-overlay');
const successText = document.getElementById('success-text');
const closeSuccess = document.getElementById('close-success');

checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        orderMessage.textContent = "Your cart is empty. Add some items before checking out.";
        return;
    }

    const name = document.getElementById('name').value;

    // show overlay
    successText.textContent = `Thank you, ${name}! Your order has been placed.`;
    successOverlay.style.display = 'flex';

    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    checkoutForm.reset();
});

closeSuccess.addEventListener('click', function () {
    successOverlay.style.display = 'none';
});

// initial render
setupSearch();
displayProducts();
renderCart();
