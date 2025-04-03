document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profile-button');
    const menuButton = document.getElementById('menu-button');
    const ordersButton = document.getElementById('orders-button');

    const profileSection = document.getElementById('profile-section');
    const menuSection = document.getElementById('menu-section');
    const ordersSection = document.getElementById('orders-section');

    const profileForm = document.getElementById('profile-form');
    const menuItemsTableBody = document.querySelector('#menu-table tbody');
    const addItemButton = document.getElementById('add-item-button');
    const addItemForm = document.getElementById('add-item-form');
    const saveItemButton = document.getElementById('save-item-button');
    const ordersListDiv = document.getElementById('orders-list');
    const logoUpload = document.getElementById('logo');
    const logoPreview = document.getElementById('business-logo-preview');

    let menuItems = []; // Array to store menu items

    // Payment Options Elements
    const paymentOptions = document.querySelectorAll('input[name="payment_options"]');
    const pochiNumber = document.getElementById('pochi_number');
    const buyGoodsNumber = document.getElementById('buy_goods_number');
    const paybillBusinessNumber = document.getElementById('paybill_business_number');
    const paybillAccountNumber = document.getElementById('paybill_account_number');
    const sendMoneyNumber = document.getElementById('send_money_number');

    // Event Listeners for Navigation Buttons
    profileButton.addEventListener('click', function() {
        profileSection.classList.remove('hidden');
        menuSection.classList.add('hidden');
        ordersSection.classList.add('hidden');
    });

    menuButton.addEventListener('click', function() {
        menuSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
        ordersSection.classList.add('hidden');
        fetchMenuItems(); // Fetch and display menu items
    });

    ordersButton.addEventListener('click', function() {
        ordersSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
        menuSection.classList.add('hidden');
        fetchOrders(); // Fetch and display orders
    });

    // Profile Form Submission (Including Payment Options)
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(profileForm);

        // Collect payment options and numbers
        const selectedOptions = [];
        paymentOptions.forEach(option => {
            if (option.checked) {
                selectedOptions.push(option.value);
            }
        });

        const paymentData = {
            options: selectedOptions,
            pochiNumber: pochiNumber.value,
            buyGoodsNumber: buyGoodsNumber.value,
            paybillBusinessNumber: paybillBusinessNumber.value,
            paybillAccountNumber: paybillAccountNumber.value,
            sendMoneyNumber: sendMoneyNumber.value
        };

        // Append payment data to formData
        formData.append('payment_data', JSON.stringify(paymentData));

        fetch('/api/business/profile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Profile updated successfully!');
        });
    });

    // Menu Functions
    function displayMenuItems() {
        menuItemsTableBody.innerHTML = menuItems.map((item, index) => `
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>Ksh ${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="editMenuItem(${index})">Edit</button>
                    <button onclick="deleteMenuItem(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function fetchMenuItems() {
        fetch('/api/business/menu')
            .then(response => response.json())
            .then(items => {
                menuItems = items;
                displayMenuItems();
            });
    }

    addItemButton.addEventListener('click', function() {
        addItemForm.classList.remove('hidden');
    });

    saveItemButton.addEventListener('click', function() {
        const name = document.getElementById('new-item-name').value;
        const description = document.getElementById('new-item-description').value;
        const price = parseFloat(document.getElementById('new-item-price').value);

        const newItem = { name, description, price };
        menuItems.push(newItem);

        fetch('/api/business/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuItems)
        })
        .then(() => {
            addItemForm.classList.add('hidden');
            displayMenuItems();
        });
    });

    // Edit and Delete Item Functions
    window.editMenuItem = function(index) {
        const item = menuItems[index];

        const editForm = document.createElement('div');
        editForm.innerHTML = `
            <h3>Edit Item</h3>
            <input type="text" id="edit-item-name" value="${item.name}">
            <input type="text" id="edit-item-description" value="${item.description}">
            <input type="number" id="edit-item-price" value="${item.price}">
            <button id="update-item-button">Update Item</button>
            <button id="cancel-edit-button">Cancel</button>
        `;

        menuSection.appendChild(editForm);

        document.getElementById('update-item-button').addEventListener('click', function() {
            const name = document.getElementById('edit-item-name').value;
            const description = document.getElementById('edit-item-description').value;
            const price = parseFloat(document.getElementById('edit-item-price').value);

            menuItems[index] = { name, description, price };

            fetch('/api/business/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItems)
            })
            .then(() => {
                menuSection.removeChild(editForm);
                displayMenuItems();
            });
        });

        document.getElementById('cancel-edit-button').addEventListener('click', function() {
            menuSection.removeChild(editForm);
        });
    };

    window.deleteMenuItem = function(index) {
        menuItems.splice(index, 1);

        fetch('/api/business/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuItems)
        })
        .then(() => {
            displayMenuItems();
        });
    };

    // Orders Functions
    function fetchOrders() {
        fetch('/api/business/orders')
            .then(response => response.json())
            .then(orders => {
                ordersListDiv.innerHTML = orders.map(order => `<div>Order ID: ${order.orderId} - Address: ${order.address}</div>`).join('');
            });
        }

    // Logo Upload Functionality
    logoUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Payment Options Logic
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const value = this.value;
            const isChecked = this.checked;

            if (value === 'pochi') {
                pochiNumber.classList.toggle('hidden', !isChecked);
            } else if (value === 'buy_goods') {
                buyGoodsNumber.classList.toggle('hidden', !isChecked);
            } else if (value === 'paybill') {
                paybillBusinessNumber.classList.toggle('hidden', !isChecked);
                paybillAccountNumber.classList.toggle('hidden', !isChecked);
            } else if (value === 'send_money') {
                sendMoneyNumber.classList.toggle('hidden', !isChecked);
            }
        });
    });
    // ... (your existing JavaScript) ...

const reviewsSection = document.getElementById('reviews-section');
const reviewsListDiv = document.getElementById('reviews-list');

// ... (your existing JavaScript) ...

ordersButton.addEventListener('click', function() {
    // ...
    fetchOrders(); // Fetch and display orders
    fetchReviews(); // Fetch reviews
});

function fetchReviews() {
    fetch('/api/business/reviews')
        .then(response => response.json())
        .then(reviews => {
            reviewsListDiv.innerHTML = reviews.map(review => `
                <div>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                    <p><strong>Comment:</strong> ${review.comment}</p>
                </div>
            `).join('');
        });
}

// Add reviews section to navigation
const reviewsButton = document.createElement('button');
reviewsButton.textContent = 'Reviews';
reviewsButton.id = 'reviews-button';
document.querySelector('nav').appendChild(reviewsButton);

reviewsButton.addEventListener('click', function(){
    reviewsSection.classList.remove('hidden');
    profileSection.classList.add('hidden');
    menuSection.classList.add('hidden');
    ordersSection.classList.add('hidden');
    fetchReviews();
});
});