document.querySelector(".register-btn").addEventListener("click", function() {
  alert("Redirecting to Business Registration...");
});

document.querySelector(".customer-btn").addEventListener("click", function() {
  alert("Redirecting to Customer Signup...");
});

document.querySelector(".signin-btn").addEventListener("click", function() {
  alert("Redirecting to Business Owner Login...");
});

// Add this code to handle form submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      nationalId: document.getElementById('nationalId').value
  };

  fetch('/api/customers/register', { // Replace with your actual endpoint if different
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      alert('Registration successful!'); // Or handle success in another way
      // Handle success (e.g., show a success message)
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Registration failed!'); // Or handle error in another way
      // Handle error (e.g., show an error message)
  });
});