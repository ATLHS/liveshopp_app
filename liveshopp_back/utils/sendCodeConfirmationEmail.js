let nodemailer = require('nodemailer');

module.exports = {
    sendCodeToConfirmEmailRegistration: async (userEmail, code) => {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            tls: {
                ciphers: "SSLv3",
            },
            from: process.env.LIVESHOPP_EMAIL,
            secureConnection: true,
            auth: {
                user: process.env.LIVESHOPP_EMAIL, // generated ethereal user
                pass: process.env.LIVESHOPP_EMAIL_PASSWORD, // generated ethereal password
            },
        });

        const template = `<div>Hello,</div><br/>
                          <div>Votre code de confirmation Liveshopp est : </div>
                          <b>${code}</b><br/><br/>
                          <div>L'équipe Liveshopp 👋</div>`

        let info = await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: userEmail, // list of receivers
            subject: "Code de confirmation", // Subject line
            html: template,
        });
    },
};