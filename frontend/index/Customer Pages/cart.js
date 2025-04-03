document.addEventListener('DOMContentLoaded', function() {
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    const addressPaymentDiv = document.getElementById('address-payment');
    const confirmAddressPaymentButton = document.getElementById('confirm-address-payment');
    const orderTrackingDiv = document.getElementById('order-tracking');
    const markDeliveredButton = document.getElementById('mark-delivered');
    const reviewFeedbackDiv = document.getElementById('review-feedback');
    const submitReviewButton = document.getElementById('submit-review');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderDetails = {};

    function displayCartItems() {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div>
                <p>${item.name} - Ksh ${item.price}</p>
            </div>
        `).join('');
    }

    checkoutButton.addEventListener('click', function() {
        addressPaymentDiv.classList.remove('hidden');
    });

    confirmAddressPaymentButton.addEventListener('click', function() {
        const firstName = document.getElementById('first_name').value;
        const buildingName = document.getElementById('building_name').value;
        const houseNumber = document.getElementById('house_number').value;
        const street = document.getElementById('street').value;
        const payment = document.getElementById('payment-method').value;

        orderDetails = {
            address: {
                first_name: firstName,
                building_name: buildingName,
                house_number: houseNumber,
                street: street
            },
            payment: payment,
            items: cart,
            timestamp: new Date().toISOString()
        };

        // Send order details to backend (simulate order creation)
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
        .then(response => response.json())
        .then(data => {
            orderTrackingDiv.classList.remove('hidden');
            addressPaymentDiv.classList.add('hidden');
            document.getElementById('order-id').textContent = data.orderId;
            document.getElementById('order-status').textContent = 'Processing';
            document.getElementById('order-timestamp').textContent = orderDetails.timestamp;
            document.getElementById('order-address').textContent = JSON.stringify(orderDetails.address); // Display address as JSON string
            document.getElementById('order-payment').textContent = orderDetails.payment;
        });
    });

    markDeliveredButton.addEventListener('click', function() {
        // Simulate marking order as delivered
        document.getElementById('order-status').textContent = 'Delivered';
        reviewFeedbackDiv.classList.remove('hidden');
        orderTrackingDiv.classList.add('hidden');
    });

    submitReviewButton.addEventListener('click', function() {
        const reviewText = document.getElementById('review-text').value;
        const reviewImage = document.getElementById('review-image').files[0];

        // Send review to backend (simulate review submission)
        // You'll need to handle image upload separately
        console.log('Review submitted:', reviewText, reviewImage);

        // Clear cart and show confirmation
        localStorage.removeItem('cart');
        alert('Review submitted. Thank you!');
        window.location.href = '/frontend/index/Customer Pages/customer-dashboard.html';
    });

    displayCartItems();
});