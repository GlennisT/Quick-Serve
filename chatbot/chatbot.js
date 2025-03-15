// Show or Hide the Chatbot Widget
function toggleChatbot() {
    const chatbotWidget = document.getElementById('chatbot-widget');
    chatbotWidget.style.display = chatbotWidget.style.display === 'none' ? 'flex' : 'none';
  }
  
  // Send Message to Chatbot
  function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return;
  
    // Display user message
    displayMessage('user', userInput);
  
    // Send user message to server (simulate AI response)
    fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    })
      .then(response => response.json())
      .then(data => displayMessage('chatbot', data.response))
      .catch(err => console.error('Error:', err));
  
    // Clear the input field
    document.getElementById('user-input').value = '';
  }
  
  // Display Message in Chat
  function displayMessage(sender, message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll to the bottom
  }
  