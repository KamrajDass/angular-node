const admin = require("firebase-admin");
const serviceAccount = require("./badshahcric.json"); // Path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // You can also specify the database URL if you're using Firebase Realtime Database
  // databaseURL: 'https://your-project-id.firebaseio.com'
});

module.exports = admin;
