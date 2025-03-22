const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        console.log("SMS sent to:", to);
    } catch (error) {
        console.error("SMS Error:", error.message);
    }
};

module.exports = { sendSMS };
