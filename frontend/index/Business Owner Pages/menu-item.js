// Fetch menu items from API
fetch('/api/business/menu')
    .then(response => response.json())
    .then(items => {
        const menuList = document.getElementById('menu-items-list');
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Price: KES ${item.price.toFixed(2)}</p>
                </div>
            `;
            menuList.appendChild(menuItem);
        });
    })
    .catch(error => console.error('Error fetching menu items:', error));

// Add new item functionality
document.getElementById('add-item-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemImage = document.getElementById('item-image').value;

    try {
        const response = await fetch('/api/business/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: itemName,
                description: itemDescription,
                price: itemPrice,
                image: itemImage,
            }),
        });

        if (response.ok) {
            // Item added successfully
            alert('Item added successfully!');
            // Refresh the page
            window.location.reload();
        } else {
            // Item addition failed
            alert('Failed to add item. Please try again.');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('An error occurred while adding the item.');
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