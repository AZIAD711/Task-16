// Extend the Window interface to include custom methods
interface Window{
    addToCart: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    removeFromCart: (productId: number) => void;
    
  }
  interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  
  interface CartItem extends Product {
    quantity: number;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products') as HTMLElement;
    const cartContainer = document.getElementById('cart-items') as HTMLElement;
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const filterSelect = document.getElementById('filter') as HTMLSelectElement;
    const sortSelect = document.getElementById('sort') as HTMLSelectElement;
    const clearCartButton = document.getElementById('clear-cart') as HTMLButtonElement;
  
    let products: Product[] = [];
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const apiUrl = 'https://fakestoreapi.com/products';
    // Fetch all products
    fetch(apiUrl)
      .then(response => response.json())
      .then((data: Product[]) => {
        products = data;
        renderProducts(products);
        populateFilterOptions(products);
        renderCart();
      });
  
    // Render products
    function renderProducts(products: Product[]) {
      productsContainer.innerHTML = products.map(product => `
        <div class="product">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>$${product.price}</p>
          <button onclick="window.addToCart(${product.id})">Add to Cart</button>
        </div>
      `).join('');
    }
  
    // Render cart
    function renderCart() {
      cartContainer.innerHTML = cart.map(item => `
        <li class="cart-item">
          ${item.title} - $${item.price} x ${item.quantity}
          <button onclick="window.increaseQuantity(${item.id})">+</button>
          <button onclick="window.decreaseQuantity(${item.id})">-</button>
          <button onclick="window.removeFromCart(${item.id})">Remove</button>
        </li>
      `).join('');
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    // Add to cart
    window.addToCart = function(productId: number) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      const cartItem = cart.find(item => item.id === productId);
  
      if (cartItem) {
        cartItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
  
      renderCart();
    }
  
    // Increase quantity
    window.increaseQuantity = function(productId: number) {
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
        cartItem.quantity++;
        renderCart();
      }
    }
  
    // Decrease quantity
    window.decreaseQuantity = function(productId: number) {
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          cart = cart.filter(item => item.id !== productId);
        }
        renderCart();
      }
    }

    // Remove from cart
    window.removeFromCart = function(productId: number) {
      cart = cart.filter(item => item.id !== productId);
      renderCart();
    }
  
    // Clear cart
    clearCartButton.addEventListener('click', () => {
      cart = [];
      renderCart();
    });
  
    // Search products
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query)
      );
      renderProducts(filteredProducts);
    });
  
    // Filter products by type
    filterSelect.addEventListener('change', () => {
      const selectedType = filterSelect.value;
      const filteredProducts = selectedType ? products.filter(product =>
        product.category === selectedType
      ) : products;
      renderProducts(filteredProducts);
    });
  
    // Sort products by price
    sortSelect.addEventListener('change', () => {
      const sortOrder = sortSelect.value;
      const sortedProducts = [...products].sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
      renderProducts(sortedProducts);
    });
  
    // Populate filter options
    function populateFilterOptions(products: Product[]) {
      const uniqueCategories = getUniqueCategories(products);
      filterSelect.innerHTML += uniqueCategories.map(category => `
        <option value="${category}">${category}</option>
      `).join('');
    }
  
    function getUniqueCategories(products: Product[]): string[] {
      const categories: string[] = [];
      for (const product of products) {
        if (categories.includes(product.category)) {
          categories.push(product.category);
        }
      }
      return categories;
    }
  });
  
  