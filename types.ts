interface Window {
  addToCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  getUniqueCategories:(products: Product[] )=>void;
}

