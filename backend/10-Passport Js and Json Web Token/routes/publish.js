const express = require("express");
const bodyParser = require("body-parser");
const publishRouter = express.Router();
const admin = require("../firebase-admin"); // Adjust path as needed
// Middleware to parse JSON bodies
publishRouter.use(bodyParser.json());

// Function to send a notification
async function sendNotification(registrationToken, payload) {
  try {
    const response = await admin.messaging().send({
      token: registrationToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    });

    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Route to handle  operations  on all productss
publishRouter
  .route("/")
  .get(async (req, res) => {})
  .post(async (req, res) => {
    let device_token = req.body.device_token;
    let title = req.body.notification.title;
    let body = req.body.notification.body;
    let data = req.body.data;
    if (!device_token || !title || !body) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const payload = {
      title,
      body,
      data: data || {},
    };

    try {
      const response = await sendNotification(device_token, payload);
      res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error sending notification",
        error: error.message,
      });
    }
  });

module.exports = publishRouter;
