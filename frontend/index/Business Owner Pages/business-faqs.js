document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');

        answer.style.display = 'none'; // Initially hide the answer

        question.addEventListener('click', function() {
            if (answer.style.display === 'none') {
                answer.style.display = 'block'; // Show the answer
            } else {
                answer.style.display = 'none'; // Hide the answer
            }
        });
    });
});