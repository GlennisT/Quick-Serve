// Fetch profile details from API
fetch('/api/business/profile')
    .then(response => response.json())
    .then(profile => {
        const profileDetails = document.getElementById('profile-details');
        profileDetails.innerHTML = `
            <p><strong>Business Name:</strong> ${profile.name}</p>
            <p><strong>Description:</strong> ${profile.description}</p>
            <p><strong>Address:</strong> ${profile.address}</p>
            <p><strong>Phone:</strong> ${profile.phone}</p>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Website:</strong> ${profile.website}</p>
        `;

        // Populate the form with existing data
        document.getElementById('business-name').value = profile.name;
        document.getElementById('business-description').value = profile.description;
        document.getElementById('business-address').value = profile.address;
        document.getElementById('business-phone').value = profile.phone;
        document.getElementById('business-email').value = profile.email;
        document.getElementById('business-website').value = profile.website;
    })
    .catch(error => console.error('Error fetching profile:', error));

// Update profile functionality
document.getElementById('edit-profile-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const businessName = document.getElementById('business-name').value;
    const businessDescription = document.getElementById('business-description').value;
    const businessAddress = document.getElementById('business-address').value;
    const businessPhone = document.getElementById('business-phone').value;
    const businessEmail = document.getElementById('business-email').value;
    const businessWebsite = document.getElementById('business-website').value;

    try {
        const response = await fetch('/api/business/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: businessName,
                description: businessDescription,
                address: businessAddress,
                phone: businessPhone,
                email: businessEmail,
                website: businessWebsite,
            }),
        });

        if (response.ok) {
            // Profile updated successfully
            alert('Profile updated successfully!');
            // Refresh the page
            window.location.reload();
        } else {
            // Profile update failed
            alert('Failed to update profile. Please try again.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile.');
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