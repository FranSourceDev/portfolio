// Contact form controller
const nodemailer = require('nodemailer');

// Configurar transporter de email
const createTransporter = () => {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    // Configuración para diferentes proveedores
    const configs = {
        gmail: {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        },
        protonmail: {
            host: 'smtp.protonmail.ch',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        },
        outlook: {
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        },
        custom: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Acepta certificados autofirmados (Proton Bridge)
            }
        }
    };

    return nodemailer.createTransport(configs[emailService] || configs.gmail);
};

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

        // Log del mensaje (siempre útil para debug)
        console.log('📧 Contact Form Submission:');
        console.log(`From: ${name} (${email})`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);

        // Verificar si las credenciales de email están configuradas
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.CONTACT_EMAIL) {
            try {
                const transporter = createTransporter();

                const mailOptions = {
                    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
                    replyTo: email,
                    to: process.env.CONTACT_EMAIL,
                    subject: `📬 Portfolio: ${subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #6366f1;">Nuevo mensaje de contacto</h2>
                            <hr style="border: 1px solid #e5e7eb;">
                            <p><strong>Nombre:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Asunto:</strong> ${subject}</p>
                            <hr style="border: 1px solid #e5e7eb;">
                            <h3>Mensaje:</h3>
                            <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</p>
                            <hr style="border: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 12px;">Este mensaje fue enviado desde tu portfolio.</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log('✅ Email enviado exitosamente');
            } catch (emailError) {
                console.error('⚠️ Error al enviar email:', emailError.message);
                // No fallamos la request, solo logueamos el error
            }
        } else {
            console.log('⚠️ Email no configurado - mensaje solo guardado en consola');
        }

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
