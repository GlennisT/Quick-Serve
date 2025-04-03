// Fetch cart items from API
fetch('/api/cart')
    .then(response => response.json())
    .then(cart => {
        const cartItems = document.getElementById('cart-items');
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <p><strong>${item.name}</strong> (${item.quantity}) - KES ${item.price.toFixed(2)}</p>
            `;
            cartItems.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        document.getElementById('total-price').textContent = `Total: KES ${totalPrice.toFixed(2)}`;
    })
    .catch(error => console.error('Error fetching cart:', error));

// Submit order functionality
document.getElementById('address-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const phone = document.getElementById('phone').value;

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                street,
                city,
                postalCode,
                phone,
            }),
        });

        if (response.ok) {
            // Order placed successfully
            alert('Order placed successfully!');
            window.location.href = 'order-confirmation.html'; // Redirect to order confirmation page
        } else {
            // Order placement failed
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while placing the order.');
    }
});

// Navigation links
document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const page = event.target.textContent.toLowerCase();
        if (page === 'logout') {
            // Implement logout logic here
            alert('Logout functionality not implemented yet.');
        } else {
            // Navigate to the corresponding page
            window.location.href = `${page}.html`;
        }
    });
});
// Navigation links
document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const page = event.target.textContent.toLowerCase();
        if (page === 'logout') {
            // Implement logout logic here
            fetch('/api/customers/logout', {
                method: 'POST',
            })
            .then(response => {
                if (response.ok) {
                    // Logout successful
                    alert('Logout successful!');
                    window.location.href = 'index.html'; // Redirect to the login page
                } else {
                    // Logout failed
                    alert('Logout failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('An error occurred during logout.');
            });
        } else {
            // Navigate to the corresponding page
            window.location.href = `${page}.html`;
        }
    });
});