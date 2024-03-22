const nodemailer = require('nodemailer');

const sendBulkEmail = async (email, subject, message, user, pass, provider) => {
    try {
        let transporter;

        if (provider === "gmail") {
            transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: user,
                    pass: pass
                }
            });
        } else if (provider === "outlook") {
            transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
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

        // console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
};

module.exports = { sendBulkEmail };
