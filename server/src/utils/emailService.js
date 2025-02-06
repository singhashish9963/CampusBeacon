
import nodemailer from "nodemailer";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USERNAME, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

console.log(process.env.EMAIL_FROM)
/**

 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body of the email
 * @param {string} options.html - HTML body of the email (optional)
 **/

export const sendEmail = asyncHandler(async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, 
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully to", to);
});

