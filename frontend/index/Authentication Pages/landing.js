document.addEventListener('DOMContentLoaded', function() {
    const customerSignupButton = document.getElementById('customerSignupButton');
    const registerBusinessButton = document.getElementById('registerBusinessButton');
    const customerSignupForm = document.getElementById('customerSignupForm');
    const registerBusinessForm = document.getElementById('registerBusinessForm');

    customerSignupButton.addEventListener('click', () => {
        customerSignupForm.classList.remove('hidden');
        registerBusinessForm.classList.add('hidden');
        customerSignupButton.classList.add('active');
        registerBusinessButton.classList.remove('active');
    });

    registerBusinessButton.addEventListener('click', () => {
        registerBusinessForm.classList.remove('hidden');
        customerSignupForm.classList.add('hidden');
        registerBusinessButton.classList.add('active');
        customerSignupButton.classList.remove('active');
    });

    // Function to display messages and loading
    function displayMessage(message, isError = false, isLoading = false) {
        const loadingIndicator = document.getElementById('loading-indicator');
        const messageText = document.getElementById('message-text');
        const messageIcon = document.getElementById('message-icon');

        if (isLoading) {
            loadingIndicator.style.display = 'inline';
            messageText.style.display = 'none';
            messageIcon.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
            messageText.style.display = 'inline';
            messageText.textContent = message;
            messageText.style.color = isError ? '#8f0936e8' : 'pink'; // Your color scheme
            messageIcon.style.display = 'inline';
            messageIcon.textContent = isError ? '❌' : '✅'; // Error or success icon
            messageIcon.style.color = isError ? '#8f0936e8' : 'pink'; // Your color scheme
        }
    }

    // Common redirect function
    function redirectWithDelay(url) {
        setTimeout(() => {
            window.location.href = url;
        }, 2000); // Redirect after 2 seconds
    }

    function validatePhoneNumber(inputId) {
        const phoneNumberInput = document.getElementById(inputId);
        const phoneNumber = phoneNumberInput.value;

        // Regular expression to check if the number starts with +254 and has 13 digits
        const phoneRegex = /^\+254\d{9,10}$/;

        if (!phoneRegex.test(phoneNumber)) {
            alert('Please enter a valid Kenyan phone number (e.g., +2547XXXXXXXX or +2541XXXXXXXX).');
            phoneNumberInput.focus();
            return false; // Prevent form submission
        }

        return true; // Allow form submission
    }

    // Customer sign up fetch
    document.getElementById('customerSignup').addEventListener('submit', async (e) => {
        if(!validatePhoneNumber("customerPhoneNumber")){
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        try {
            displayMessage('Loading...', false, true); // Loading indicator
            const response = await fetch('http://localhost:5000/api/customers/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                displayMessage(errorData.message || 'Registration failed.', true);
                return;
            }

            const result = await response.json();
            displayMessage('Sign-up successful! Welcome aboard.');
            redirectWithDelay('/frontend/index/Customer Pages/customer-dashboard.html');
        } catch (error) {
            displayMessage('Error: ' + error.message, true);
        }
    });

    // Business sign up fetch
    document.getElementById('businessSignup').addEventListener('submit', async (e) => {
        if(!validatePhoneNumber("businessPhoneNumber")){
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        try {
            displayMessage('Loading...', false, true); // Loading indicator
            const response = await fetch('http://localhost:5000/api/business/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                displayMessage(errorData.message || 'Registration failed.', true);
                return;
            }

            const result = await response.json();
            displayMessage('Sign-up successful! Welcome aboard.');
            redirectWithDelay('/frontend/index/Business Owner Pages/business-dashboard.html');
        } catch (error) {
            displayMessage('Error: ' + error.message, true);
        }
    });
});