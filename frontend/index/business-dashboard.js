document.addEventListener('DOMContentLoaded', function() {
    // Example: Displaying dummy menu items
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = `
        <div class="menu-item">
            <h3>Burger</h3>
            <p>Price: $10.00</p>
        </div>
        <div class="menu-item">
            <h3>Pizza</h3>
            <p>Price: $12.00</p>
        </div>
        <div class="menu-item">
            <h3>Salad</h3>
            <p>Price: $8.00</p>
        </div>
        <div class="menu-item">
            <h3>Fries</h3>
            <p>Price: $5.00</p>
        </div>
    `;

    // Example: Add menu item button functionality
    const addMenuItemButton = document.getElementById('add-menu-item');
    addMenuItemButton.addEventListener('click', function() {
        alert("Add menu item functionality will be implemented later.");
    });
});