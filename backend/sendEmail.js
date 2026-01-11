// backend/sendEmail.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Robust env loading
const envPaths = [
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '.env')
];

let envContent = '';
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    console.log('Found .env at:', p);
    envContent = fs.readFileSync(p, 'utf8');
    break;
  }
}

// Manual parsing to handle weird line endings or cat errors
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // remove quotes
    process.env[key] = value;
  }
});

console.log('--- Email Server Debug ---');
console.log('Using hardcoded credentials for:', 'isaiasgeronimo12@gmail.com');
console.log('--------------------------');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'isaiasgeronimo12@gmail.com',
    pass: 'enfbduhbbbqoxysr'
  }
});

app.post('/send-confirmation', async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message || error });
  }
});

app.post('/send-contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Send email TO the admin (hardcoded as the sender for now, or could make configurable)
    // The "from" is the system email, but we reply-to the user's email
    await transporter.sendMail({
      from: 'isaiasgeronimo12@gmail.com', // System sender
      to: 'isaiasgeronimo12@gmail.com',   // Admin receives the contact form
      replyTo: email,                     // Reply directly to the user
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    });
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message || error });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
