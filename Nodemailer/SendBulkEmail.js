const nodemailer = require('nodemailer');

const sendBulkEmail = async (email, subject, message, user, pass, provider) => {
    try {
        let transporter;

        if (provider === "gmail") {
            transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: "gmail",
                secure: Boolean(process.env.SECURE),
                auth: {
                    user: user,
                    pass: pass
                }
            });
        } else if (provider === "outlook") {
            transporter = nodemailer.createTransport({
                service: "hotmail",
                host: "smtp-mail.outlook.com",
                port:587,
                auth: {
                    user: user,
                    pass: pass
                }
            });
        } else {
            throw new Error("Invalid email provider");
        }

        const info = await transporter.sendMail({
            from: user,
            to: email,
            subject: subject,
            html: message,
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
};

module.exports = { sendBulkEmail };
