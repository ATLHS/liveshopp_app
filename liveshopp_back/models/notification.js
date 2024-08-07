const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['User', 'Seller'],
      required: false, // Not required as the user might not be logged in
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userType', // Dynamic reference based on userType
      required: false, // Not required as the user might not be logged in
    },
    deviceId: {
      type: String, // Unique identifier for the device (could be UUID)
      required: true,
    },
    token: {
      type: String, // Firebase notification token
      required: true,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
