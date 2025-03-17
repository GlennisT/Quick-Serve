const express = require('express');
const { getAIResponse, processAIData } = require('../controllers/ai_models'); // Import the AI functions
const router = express.Router();

// Route to get AI response based on user input
router.post('/ai-response', async (req, res) => {
  try {
    const { inputData } = req.body; // Get data from request body (user input)

    // Check if input data exists
    if (!inputData) {
      return res.status(400).json({ message: 'Input data is required' });
    }

    const aiResponse = await getAIResponse(inputData); // Call AI function for response
    res.status(200).json({ response: aiResponse }); // Send back the AI response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing AI response', error });
  }
});

// Route to process AI data
router.post('/process-data', async (req, res) => {
  try {
    const { data } = req.body; // Get data to be processed by AI model

    if (!data) {
      return res.status(400).json({ message: 'Data is required for processing' });
    }

    const processedData = await processAIData(data); // Process the data through AI model
    res.status(200).json({ processedData }); // Return processed data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing AI data', error });
  }
});

module.exports = router;
