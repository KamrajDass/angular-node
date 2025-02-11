// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./account.json"); // Path to your service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "testing-135.appspot.com", // Replace with your Firebase Storage bucket
});

const bucket = admin.storage().bucket();
module.exports = bucket;
