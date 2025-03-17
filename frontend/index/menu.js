// menu.js

// Array to store cart items
let cart = [];

// Function to add item to cart
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity if item already in cart
  } else {
    cart.push({ ...item, quantity: 1 }); // Add new item to cart
  }
  updateCartButton();
}

// Function to update the view cart button with the number of items in the cart
function updateCartButton() {
  const cartButton = document.getElementById("view-cart-btn");
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartButton.textContent = `View Cart (${itemCount})`;
}

// Add event listeners to each "Add to Cart" button
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const item = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
    };
    addToCart(item);
  });
});

// Initialize the cart button text
updateCartButton();
