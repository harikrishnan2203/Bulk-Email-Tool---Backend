const nodemailer = require('nodemailer');
// const { escapeHtml } = require('html-entities');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
        service: process.env.SERVICE,
        post: process.env.PORT,
        secure: Boolean(process.env.SECURE),
        auth:{
            user:process.env.USER,
            pass: process.env.PASS
        }
        });
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            html: `
                <div style="display: flex; justify-content: center; align-items: center; height: 80vh; width: 100vw; padding: 10px; border-radius: 15px;">
                    <div class="border" style="height: 300px; width: 400px; border: 3px solid; background-image: url('https://img.freepik.com/free-photo/hand-pressing-envelope-that-is-sent-world_1232-278.jpg?w=1800&t=st=1708962119~exp=1708962719~hmac=8fec1316be92aeeff60fe17ada8bb49f1d46bcf78afd3273a4064548fd8a7c7c'); padding: 10px; border-radius: 15px;">
                        <h1 style="background-color: #1f5156; color: #fff; border: 3px solid black; border-radius: 15px 15px 0 0; display:flex; align-items: center !important; margin:0px">
                            <img style="width: 50px; padding: 5px; margin-left: 13px;" src="https://cdn.pixabay.com/photo/2016/06/13/17/30/mail-1454731_1280.png" alt=""> 
                            <span style="display:flex; padding-top: 11px;">Bulk Email Tool</span>
                        </h1>
                        <h3 style="color: #fff">${(subject)}</h3>
                        <hr>
                        <p style="color: #fff">This link will expire within 15 minutes. Use it before it expires, or generate a new link to continue the process.</p>
                        <a style="color: #fff;" href="${(text)}" target="_blank">click here</a>
                    </div>
                </div>
            `
        });
        return info;
    } catch (error) {
        return error;
    }
};

module.exports = {
    sendEmail
};
