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