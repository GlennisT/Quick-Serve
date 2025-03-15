 // Smooth Scrolling for Navigation Links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        // Scroll smoothly to the target section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Button Hover Effects - Dynamic Text Change on Hover
const ctaButtons = document.querySelectorAll('.cta-buttons button');
ctaButtons.forEach(button => {
    // Store the original text in a custom attribute
    button.setAttribute('data-original-text', button.textContent);

    button.addEventListener('mouseover', function() {
        this.textContent = 'Let’s Get Started!';
    });
    button.addEventListener('mouseout', function() {
        this.textContent = this.getAttribute('data-original-text');
    });
});

// Form Validation for Business Registration
document.querySelector('form#business-registration')?.addEventListener('submit', function(e) {
    const businessName = document.querySelector('#business-name').value;
    const email = document.querySelector('#email').value;
    const contactNo = document.querySelector('#contact-no').value;
    const logo = document.querySelector('#logo').value;

    // Check if all required fields are filled
    if (!businessName || !email || !contactNo || !logo) {
        alert('Please fill out all required fields.');
        e.preventDefault();  // Prevent form submission if validation fails
    } else {
        // Proceed with form submission
        console.log('Business Registration Successful!');
    }
});

// Button Click to Redirect to Business Registration Page (from Hero Section)
document.querySelector('.cta-register-button')?.addEventListener('click', () => {
    window.location.href = 'business-register.html';  // Redirect to business registration page
});

// Modal Open and Close (Business Registration Modal)
document.querySelector('#openModalButton')?.addEventListener('click', function() {
    document.querySelector('#registrationModal').style.display = 'block';  // Show modal
});
document.querySelector('#closeModalButton')?.addEventListener('click', function() {
    document.querySelector('#registrationModal').style.display = 'none';  // Hide modal
});

// Optional: Contact Form Validation
document.querySelector('form#contact-form')?.addEventListener('submit', function(e) {
    const name = document.querySelector('#contact-name').value;
    const email = document.querySelector('#contact-email').value;
    const message = document.querySelector('#contact-message').value;

    // Simple validation for contact form
    if (!name || !email || !message) {
        alert('Please fill out all fields in the contact form.');
        e.preventDefault();  // Prevent form submission if validation fails
    } else {
        // Proceed with form submission
        console.log('Contact Form Submitted!');
    }
});

// Display "Back to Top" Button when Scrolling
window.addEventListener('scroll', () => {
    const backToTopButton = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Smooth Scroll to Top on "Back to Top" Button Click
document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

