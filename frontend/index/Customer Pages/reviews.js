// Fetch reviews from API
fetch('/api/reviews')
    .then(response => response.json())
    .then(reviews => {
        const reviewList = document.getElementById('review-list');
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');
            reviewDiv.innerHTML = `
                <p><strong>${review.author}</strong></p>
                <p>${review.text}</p>
            `;
            reviewList.appendChild(reviewDiv);
        });
    })
    .catch(error => console.error('Error fetching reviews:', error));

// Submit review functionality
document.getElementById('add-review-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const reviewText = document.getElementById('review-text').value;

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: reviewText }),
        });

        if (response.ok) {
            // Review submitted successfully
            alert('Review submitted successfully!');
            // Refresh the reviews list
            window.location.reload();
        } else {
            // Review submission failed
            alert('Failed to submit review. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An error occurred while submitting the review.');
    }
});

// Back to Dashboard
document.getElementById('back-to-dashboard').addEventListener('click', () => {
    window.location.href = 'customer-dashboard.html';
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