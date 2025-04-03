const AfricasTalking = require('africastalking');
require('dotenv').config();

const username = process.env.AT_USERNAME;
const apiKey = process.env.AT_API_KEY;

const at = AfricasTalking({ username, apiKey });
const sms = at.SMS;

async function sendAtSms(phoneNumber, message) {
  try {
    const result = await sms.send({
      to: [phoneNumber],
      message: message,
    });
    console.log('AT SMS sent:', result);
    return result;
  } catch (error) {
    console.error('AT SMS error:', error);
    throw error;
  }
}

module.exports = { sendAtSms };