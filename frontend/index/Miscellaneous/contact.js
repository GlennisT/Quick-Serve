document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Client-side validation (basic)
    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Send data to server (placeholder for now)
    fetch('/contact', { // Replace '/contact' with your server endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
    })
    .then(response => {
        if (response.ok) {
            alert("Message sent successfully!");
            document.getElementById('contact-form').reset(); // Clear the form
        } else {
            alert("Failed to send message. Please try again later.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    });
});