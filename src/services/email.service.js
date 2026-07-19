import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Prince Banking company" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Prince Banking company!";
  const text = `Hello ${name},\n\nThank you for registering at Prince Banking company. We're excited to have you on board!\n\nBest regards,\nThe Prince Banking company Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Prince Banking company. We're excited to have you on board!</p><p>Best regards,<br>The Prince Banking company Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Prince Banking company Team`;
  const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Prince Banking company Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed";
  const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Prince Banking company Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Prince Banking company Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}


//send otp in case of forget password
async function sendOTPEmail(email, name, otp) {
    return transporter.sendMail({
        to: email,
        subject: "Reset Your Password",
        html: `
            <h2>Hello ${name},</h2>

            <p>We received a request to reset your password.</p>

            <p>Your verification code is:</p>

            <h1 style="letter-spacing:5px;">${otp}</h1>

            <p>This OTP is valid for <strong>10 minutes</strong>.</p>

            <p>If you didn't request a password reset, you can safely ignore this email.</p>

            <br>
            <p>Regards,</p>
          <p><strong>Prince Banking Company Team</strong></p>
        `
    });
}


// send confirmation email to user that new password is set
async function sendNewPasswordSetEmail(email, name) {
    return transporter.sendMail({
        to: email,
        subject: "Password Reset Successful",
        html: `
            <h2>Hello ${name},</h2>

            <p>Your password has been successfully reset.</p>

            <p>You can now log in with your new password.</p>

            <br>
            <p>Regards,</p>
            <p><strong>Prince Banking Company Team</strong></p>
        `
    });
}


// send to user when de deposit money to his account
async function sendDepositEmail(userEmail, name, amount , accountNumber) {
    const subject = "Deposit Successful!";
    const text = `Hello ${name},\n\nYour deposit of $${amount} was successful in account number ${accountNumber}.\n\nBest regards,\nThe Prince Banking company Team`;
    const html = `<p>Hello ${name},</p><p>Your deposit of $${amount} was successful.</p><p>Best regards,<br>The Prince Banking company Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}


// send to user after withdraw money from his account
async function sendWithdrawEmail(userEmail, name, amount , accountNumber) {
    const subject = "Withdraw Successful!";
    const text = `Hello ${name},\n\nYour withdraw of $${amount} was successful in account number ${accountNumber}.\n\nBest regards,\nThe Prince Banking company Team`;
    const html = `<p>Hello ${name},</p><p>Your withdraw of $${amount} was successful.</p><p>Best regards,<br>The Prince Banking company Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

export {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
  sendOTPEmail,
  sendNewPasswordSetEmail,
  sendDepositEmail,
  sendWithdrawEmail,
};
