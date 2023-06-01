let nodemailer = require('nodemailer');

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

module.exports = {
    sendCodeToConfirmEmailRegistration: async (userEmail, code) => {
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
    sendWelcomeEmail: async (customer) => {
        const template = `<div>Hello ${customer.firstname}, Bienvenue sur Liveshopp 👋 !</div><br/>
                          <div>Nous sommes très heureux d’accueillir de nouveaux utilisateurs et pour ce faire, nous sommes disponibles pour toute question ou information dont vous auriez besoin à propos de l’application. <br/><br/> 
                          Liveshopp est l’app qui réunit la communauté de la mode en live et qui vous permet d’échanger en direct avec votre vendeur préféré, et de pouvoir faire de bonnes affaires en achetant l’article sur lequel vous avez eu un coup de coeur en un clic 😍<br/><br/> 
                          Pour bien débuter sur Liveshopp et pouvoir commencer à enchérir sur des articles pendant les lives, n’oubliez pas de renseigner : <br/><br/>
                          👍 : Votre adresse de livraison, qui sera utile au vendeur pour vous envoyer les articles <br/><br/>
                          ✌️ : Un moyen de paiement, qui vous permettra d’acheter en direct. <br/><br/>
                          Voilà ! Bons lives ${customer.firstname} 🔥 !<br/><br/>
                          Sofiane, fondateur chez Liveshopp</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: "Welcome", // Subject line
            html: template,
        });
    },
};