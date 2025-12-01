// Contact form controller
// Note: nodemailer is commented out for now. Install it when ready to send real emails.

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Por favor completa todos los campos'
            });
        }

        // For now, we'll just log the message and return success
        // In production, you would configure nodemailer with your email service
        console.log('📧 Contact Form Submission:');
        console.log(`From: ${name} (${email})`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);

        // TODO: Configure nodemailer to actually send emails
        // Example configuration (commented out):
        /*
        const transporter = nodemailer.createTransporter({
          service: 'gmail', // or your email service
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
    
        const mailOptions = {
          from: email,
          to: process.env.CONTACT_EMAIL,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>Nuevo mensaje de contacto</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `
        };
    
        await transporter.sendMail(mailOptions);
        */

        res.json({
            success: true,
            message: 'Mensaje enviado exitosamente. Te contactaré pronto!'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
            error: error.message
        });
    }
};

module.exports = {
    sendContactEmail
};
