// Add event listener for form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation (you can enhance this)
    if (email === "" || password === "") {
        alert("Please fill in both fields.");
        return;
    }

    // Example of a basic login check (you can replace this with an API call to validate credentials)
    const dummyEmail = "user@example.com"; // Replace with your actual login logic
    const dummyPassword = "password123"; // Replace with your actual login logic

    if (email === dummyEmail && password === dummyPassword) {
        alert("Login successful!");

        // Save login state (e.g., store in local storage or session storage for persistent login)
        sessionStorage.setItem("loggedIn", true); // Example of using sessionStorage

        // Redirect to the main page/dashboard or wherever after login
        window.location.href = 'dashboard.html'; // Replace with your actual next page URL
    } else {
        alert("Invalid email or password. Please try again.");
    }
});
