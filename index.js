var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
document.addEventListener('DOMContentLoaded', function () {
    var productsContainer = document.getElementById('products');
    var cartContainer = document.getElementById('cart-items');
    var searchInput = document.getElementById('search');
    var filterSelect = document.getElementById('filter');
    var sortSelect = document.getElementById('sort');
    var clearCartButton = document.getElementById('clear-cart');
    var products = [];
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    var apiUrl = 'https://fakestoreapi.com/products';
    // Fetch all products
    fetch(apiUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        products = data;
        renderProducts(products);
        populateFilterOptions(products);
        renderCart();
    });
    // Render products
    function renderProducts(products) {
        productsContainer.innerHTML = products.map(function (product) { return "\n        <div class=\"product\">\n          <img src=\"".concat(product.image, "\" alt=\"").concat(product.title, "\">\n          <h3>").concat(product.title, "</h3>\n          <p>").concat(product.description, "</p>\n          <p>$").concat(product.price, "</p>\n          <button onclick=\"window.addToCart(").concat(product.id, ")\">Add to Cart</button>\n        </div>\n      "); }).join('');
    }
    // Render cart
    function renderCart() {
        cartContainer.innerHTML = cart.map(function (item) { return "\n        <li class=\"cart-item\">\n          ".concat(item.title, " - $").concat(item.price, " x ").concat(item.quantity, "\n          <button onclick=\"window.increaseQuantity(").concat(item.id, ")\">+</button>\n          <button onclick=\"window.decreaseQuantity(").concat(item.id, ")\">-</button>\n          <button onclick=\"window.removeFromCart(").concat(item.id, ")\">Remove</button>\n        </li>\n      "); }).join('');
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Add to cart
    window.addToCart = function (productId) {
        var product = products.find(function (p) { return p.id === productId; });
        if (!product)
            return;
        var cartItem = cart.find(function (item) { return item.id === productId; });
        if (cartItem) {
            cartItem.quantity++;
        }
        else {
            cart.push(__assign(__assign({}, product), { quantity: 1 }));
        }
        renderCart();
    };
    // Increase quantity
    window.increaseQuantity = function (productId) {
        var cartItem = cart.find(function (item) { return item.id === productId; });
        if (cartItem) {
            cartItem.quantity++;
            renderCart();
        }
    };
    // Decrease quantity
    window.decreaseQuantity = function (productId) {
        var cartItem = cart.find(function (item) { return item.id === productId; });
        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            }
            else {
                cart = cart.filter(function (item) { return item.id !== productId; });
            }
            renderCart();
        }
    };
    // Remove from cart
    window.removeFromCart = function (productId) {
        cart = cart.filter(function (item) { return item.id !== productId; });
        renderCart();
    };
    // Clear cart
    clearCartButton.addEventListener('click', function () {
        cart = [];
        renderCart();
    });
    // Search products
    searchInput.addEventListener('input', function () {
        var query = searchInput.value.toLowerCase();
        var filteredProducts = products.filter(function (product) {
            return product.title.toLowerCase().includes(query);
        });
        renderProducts(filteredProducts);
    });
    // Filter products by type
    filterSelect.addEventListener('change', function () {
        var selectedType = filterSelect.value;
        var filteredProducts = selectedType ? products.filter(function (product) {
            return product.category === selectedType;
        }) : products;
        renderProducts(filteredProducts);
    });
    // Sort products by price
    sortSelect.addEventListener('change', function () {
        var sortOrder = sortSelect.value;
        var sortedProducts = __spreadArray([], products, true).sort(function (a, b) {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
        renderProducts(sortedProducts);
    });
    // Populate filter options
    function populateFilterOptions(products) {
        var uniqueCategories = getUniqueCategories(products);
        filterSelect.innerHTML += uniqueCategories.map(function (category) { return "\n        <option value=\"".concat(category, "\">").concat(category, "</option>\n      "); }).join('');
    }
    function getUniqueCategories(products) {
        var categories = [];
        for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
            var product = products_1[_i];
            if (categories.includes(product.category)) {
                categories.push(product.category);
            }
        }
        return categories;
    }
});
