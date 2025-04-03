// Fetch orders from API
fetch('/api/business/orders')
    .then(response => response.json())
    .then(orders => {
        const ordersList = document.getElementById('orders-list');
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
                <p><strong>Total:</strong> KES ${order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <button data-order-id="${order.id}" data-status="preparing">Preparing</button>
                <button data-order-id="${order.id}" data-status="ready">Ready</button>
                <button data-order-id="${order.id}" data-status="delivered">Delivered</button>
            `;
            ordersList.appendChild(orderItem);
        });

        // Add event listeners to update order status buttons
        document.querySelectorAll('.order-item button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.dataset.orderId;
                const newStatus = event.target.dataset.status;

                try {
                    const response = await fetch(`/api/business/orders/${orderId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });

                    if (response.ok) {
                        // Order status updated successfully
                        alert('Order status updated!');
                        // Refresh the page
                        window.location.reload();
                    } else {
                        // Order status update failed
                        alert('Failed to update order status.');
                    }
                } catch (error) {
                    console.error('Error updating order status:', error);
                    alert('An error occurred while updating order status.');
                }
            });
        });
    })
    .catch(error => console.error('Error fetching orders:', error));

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
            fetch('/api/business-owner/logout', { // Adjust the endpoint to match your server.js
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