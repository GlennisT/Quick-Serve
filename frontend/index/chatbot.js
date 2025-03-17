// Select DOM elements
const openChatBtn = document.getElementById('open-chat-btn');
const closeChatBtn = document.getElementById('close-chat');
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Open/Close chat functionality
openChatBtn.addEventListener('click', () => {
  chatContainer.classList.add('open'); // Makes the chatbox visible
});

closeChatBtn.addEventListener('click', () => {
  chatContainer.classList.remove('open'); // Hides the chatbox
});

// Send message functionality
sendBtn.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message) {
    displayMessage('user', message);
    chatInput.value = '';
    // Simulate bot response (Replace with AI logic later)
    setTimeout(() => {
      const botResponse = "Thanks for your message! How can I assist you?";
      displayMessage('bot', botResponse);
    }, 1000);
  }
});

// Display message in chat window
function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to bottom
}

// Handle 'Enter' key press for sending message
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendBtn.click();
  }
});
