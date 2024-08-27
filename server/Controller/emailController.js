const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const SendEmail =async (req, res) => {

  console.log("YOU ARE IN THE SEND EMAIL FUNCTION")
  const { startupEmail, startupName, investorEmail, investorName, investorId, startupId , investorPhonenumber, startupPhonenumber } = req.body;

  console.log("startup email: "+startupEmail)
  console.log("investor email: "+investorEmail)

  try {
    // Set up the nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'starupconnectsi@gmail.com',
        pass: 'mozpritxfauoiwad'   
      }
    });

    // Email to Startup
    let startupMailOptions = {
      from: 'sstarupconnectsi@gmail.com',
      to: startupEmail,
      subject: 'Congratulations! 🥳 , You have recieved a new Interest from an Investor',
      text: `Dear ${startupName},\n\nInvestor ${investorName} has shown interest in your startup. You can contact them on the email: ${investorEmail} or through their phone number: ${investorPhonenumber}. Check you startupConnect 'Startup' account for more details.`
    };

    await transporter.sendMail(startupMailOptions);

    // Email to Investor
    let investorMailOptions = {
      from: 'starupconnectsi@gmail.com',
      to: investorEmail,
      subject: 'Congratulations! 🥳 , Your interest was sent to the startup!',
      text: `Dear ${investorName},\n\nYour interest has been sent to the startup.You can contact them on the email: ${startupEmail} or through their phone number: ${startupPhonenumber}. Check you startupConnect 'Investor' account for more details.`
    };

    await transporter.sendMail(investorMailOptions);

    res.status(200).send('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Failed to send emails');
  }
}

module.exports={
    SendEmail
}
