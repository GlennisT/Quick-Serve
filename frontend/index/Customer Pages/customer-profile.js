document.addEventListener('DOMContentLoaded', function() {
    const firstNameSpan = document.getElementById('first-name');
    const lastNameSpan = document.getElementById('last-name');
    const emailSpan = document.getElementById('email');
    const phoneNumberSpan = document.getElementById('phone-number');
    const addressSpan = document.getElementById('address');
    const editProfileButton = document.getElementById('edit-profile-button');
    const editProfileForm = document.getElementById('edit-profile-form');
    const profileForm = document.getElementById('profile-form');

    // Fetch customer details from backend API
    fetch('/api/customer/profile')
        .then(response => response.json())
        .then(customer => {
            firstNameSpan.textContent = customer.first_name;
            lastNameSpan.textContent = customer.last_name;
            emailSpan.textContent = customer.email;
            phoneNumberSpan.textContent = customer.phone_number;
            addressSpan.textContent = customer.address;

            // Populate edit form with existing data
            document.getElementById('first_name').value = customer.first_name;
            document.getElementById('last_name').value = customer.last_name;
            document.getElementById('email').value = customer.email;
            document.getElementById('phone_number').value = customer.phone_number;
            document.getElementById('address').value = customer.address;
        });

    editProfileButton.addEventListener('click', function() {
        editProfileForm.classList.remove('hidden');
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(profileForm);

        fetch('/api/customer/profile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Profile updated successfully!');
            // Refresh customer details
            fetch('/api/customer/profile')
                .then(response => response.json())
                .then(customer => {
                    firstNameSpan.textContent = customer.first_name;
                    lastNameSpan.textContent = customer.last_name;
                    emailSpan.textContent = customer.email;
                    phoneNumberSpan.textContent = customer.phone_number;
                    addressSpan.textContent = customer.address;
                });
            editProfileForm.classList.add('hidden');
        });
    });
});