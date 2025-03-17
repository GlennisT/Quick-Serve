document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.getElementById('menu-items');
  menuItems.addEventListener('click', function(event) {
      if (event.target.classList.contains('add-menu-item')) {
          const newItem = document.createElement('div');
          newItem.classList.add('menu-item');
          newItem.innerHTML = `
              <label for="menu-item-name">Item Name:</label>
              <input type="text" class="menu-item-name" name="menu-item-name[]">
              <label for="menu-item-price">Price:</label>
              <input type="number" class="menu-item-price" name="menu-item-price[]">
              <button type="button" class="add-menu-item">Add Item</button>
          `;
          menuItems.appendChild(newItem);
      }
  });
});