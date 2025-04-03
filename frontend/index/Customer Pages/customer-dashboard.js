document.addEventListener('DOMContentLoaded', function() {
    const restaurantsDiv = document.querySelector('.restaurants');
    const cartSection = document.getElementById('cart');
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    const reviewsSection = document.getElementById('restaurant-reviews');
    const reviewsListDiv = document.getElementById('reviews-list');
    const closeReviewsButton = document.getElementById('close-reviews');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch restaurants and add them to the page
    fetch('http://localhost:5000/api/restaurants')
        .then(response => response.json())
        .then(restaurants => {
            restaurants.forEach(restaurant => {
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('restaurant-item');
                restaurantDiv.innerHTML = `
                    <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.onerror=null; this.src='/images/default-restaurant.png';">
                    <h3>${restaurant.name}</h3>
                `;
                restaurantDiv.addEventListener('click', () => {
                    // Show restaurant menu or details
                    showRestaurantDetails(restaurant);
                });
                restaurantsDiv.appendChild(restaurantDiv);
            });
        });

    function showRestaurantDetails(restaurant) {
        // Implement logic to show restaurant menu or details
        // You can fetch and display items for this restaurant
        // For now, let's just show reviews
        fetchRestaurantReviews(restaurant.id);
    }

    function fetchRestaurantReviews(restaurantId) {
        fetch(`http://localhost:5000/api/restaurants/${restaurantId}/reviews`)
            .then(response => response.json())
            .then(reviews => {
                reviewsListDiv.innerHTML = reviews.map(review => `
                    <div>
                        <p><strong>${review.customerName}:</strong> ${review.comment} (Rating: ${review.rating})</p>
                    </div>
                `).join('');
                reviewsSection.classList.remove('hidden'); // Show reviews
                cartSection.classList.add('hidden'); // Hide cart
            });
    }

    closeReviewsButton.addEventListener('click', () => {
        reviewsSection.classList.add('hidden'); //hide reviews
        cartSection.classList.add('hidden'); //Hide cart
    });

    function addToCart(item) {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        cartSection.classList.remove('hidden'); // Show cart
        reviewsSection.classList.add('hidden'); // hide reviews
    }

    function updateCartDisplay() {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div>
                <p>${item.name} - $${item.price}</p>
            </div>
        `).join('');
    }

    checkoutButton.addEventListener('click', () => {
        // Implement checkout logic
        console.log('Checkout clicked');
    });

    updateCartDisplay(); // Initial cart display

    const profileLink = document.getElementById('profile-link');
    const profileContent = document.querySelector('.profile-content');

    profileLink.addEventListener('click', function(event) {
        event.preventDefault();
        profileContent.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!profileLink.contains(event.target) && !profileContent.contains(event.target)) {
            profileContent.classList.add('hidden');
        }
    });
});