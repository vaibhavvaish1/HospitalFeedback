/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


console.log(gmailEmail, gmailPassword);

exports.sendFeedbackEmail = functions.firestore
    .document("feedback/{feedbackId}")
    .onCreate((snap, context) => {
      const feedbackData = snap.data();

      const mailOptions = {
        from: gmailEmail,
        // eslint-disable-next-line max-len
        to: "devvaibhav943@gmail.com", // Change to your recipient email address
        subject: "New Hospital Feedback Received",
        text: `Feedback received from ${feedbackData.name} (${feedbackData.email}):
Rating: ${feedbackData.rating}
Feedback: ${feedbackData.feedback}`,
      };

      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error", error);
          console.error("Error sending email:", error);
          return;
        }
        console.log("Email sent:", info.response);
      });
    });
