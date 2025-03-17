// about.js (This is optional but adds functionality for the About page)

window.addEventListener('DOMContentLoaded', function() {
    // Log a welcoming message when the page loads
    console.log('Welcome to Quick_Serve! Thank you for visiting our About Us page.');

    // If you want to add some interactivity, you can include it here

    // Example: Alert when user scrolls past a certain section of the page
    const aboutSection = document.querySelector('.about-container');
    
    window.addEventListener('scroll', () => {
        const sectionPosition = aboutSection.getBoundingClientRect().top;
        if (sectionPosition < window.innerHeight / 2) {
            console.log('You have reached the About Us section!');
        }
    });

    // Example: You can dynamically update content or display other interactions
    // For example, adding some animations to the text
    const aboutText = document.querySelector('.about-container p');
    aboutText.classList.add('fade-in');
});
