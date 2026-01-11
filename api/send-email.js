// Vercel Serverless Function for sending contact form emails
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Import nodemailer dynamically
        const nodemailer = await import('nodemailer');

        // Create transporter
        const transporter = nodemailer.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || 'isaiasgeronimo12@gmail.com',
                pass: process.env.EMAIL_PASS || 'enfbduhbbbqoxysr'
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'isaiasgeronimo12@gmail.com',
            to: process.env.EMAIL_USER || 'isaiasgeronimo12@gmail.com',
            replyTo: email,
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
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Failed to send message',
            error: error.message
        });
    }
}
