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
                          <div>Votre code de confirmation Liveshopp est le suivant : </div><br/>
                          <b style="font-size: 25px">${code}</b><br/><br/>
                          <div>L'équipe Liveshopp 👋</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: userEmail, // list of receivers
            subject: "Code de confirmation", // Subject line
            html: template,
        });
    },
    sendCodeToResetPassword: async (userEmail, code) => {
        const template = `<div>Hello,</div><br/>
                          <div>Votre code de vérification Liveshopp est : </div><br/>
                          <b style="font-size: 25px">${code}</b><br/><br/>
                          <div>L'équipe Liveshopp 👋</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: userEmail, // list of receivers
            subject: "Code de vérification", // Subject line
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
    sendNoBidNotificationEmail: async (customer, product) => {
        const template = `<div>Bonjour ${customer.company_name},</div><br/>
                          <div>Nous souhaitions vous informer qu'à ce jour, aucune enchère n'a été placée sur votre article : ${product.productName}. Cependant, nous sommes heureux de constater que votre article a suscité un certain intérêt, enregistrant un nombre significatif de vues.<br/><br/> 
                          Si vous le souhaitez, nous vous encourageons à re-proposer l'article aux enchères, éventuellement avec un prix de départ légèrement réduit. Nous serions ravis de vous accompagner tout au long de ce processus.<br/><br/> 
                          Si vous avez des questions ou besoin d'assistance supplémentaire, n'hésitez pas à nous contacter. Nous sommes là pour vous aider à chaque étape de la vente.<br/><br/>
                          Nous vous souhaitons une excellente journée !<br/><br/>
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: "Aucune offre cette fois-ci.", // Subject line
            html: template,
        });
    },
    sendEmailAfterBid: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Votre offre actuelle d'un montant ${product.currentPrice} pour l'article : ${product.productName} a bien été enregistrée et sera prise en compte à la clôture de l'enchère, sous réserve des conditions suivantes :<br/><br/> 
                          1. Elle égale ou dépasse le prix de réserve fixé par le vendeur.<br/> 
                          2. Aucune offre supérieure n'est soumise pendant la durée de l'enchère.<br/> 
                          3. Votre moyen de paiement est valide.<br/><br/> 
                          Si votre offre répond à ces critères, vous n'aurez rien à faire ! Le montant de votre offre sera automatiquement débité et vous recevrez un email de confirmation.<br/><br/>
                          Nous vous remercions pour votre confiance. Pour toute question supplémentaire, n'hésitez pas à nous contacter.<br/><br/>
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `Offre prise en compte pour ${product.productName}.`, // Subject line
            html: template,
        });
    },
    sendEmailToInformOutbid: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Nous tenions à vous informer qu'un autre utilisateur a dépassé votre offre dans l'enchère pour : ${product.productName}. Ne vous laissez pas faire !<br/><br/> 
                          À vous de jouer !<br/> <br/> 
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `${product.productName} : vous avez été dépassé!`, // Subject line
            html: template,
        });
    },
    sendBidRejectedDueToLowReservePrice: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Malheureusement, votre offre sur l'article : ${product.productName} n'a pas été acceptée cette fois-ci car elle n'a pas réussi à atteindre le prix de réserve fixé par le vendeur.<br/><br/> 
                          Ne vous découragez pas ! Continuez de participer à nos enchères et qui sait, vous pourriez décrocher une pépite la prochaine fois !<br/><br/> 
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `Oops ! Votre offre n'a pas passé le cap.`, // Subject line
            html: template,
        });
    },
    sendPaymentIssueEmail: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Nous tenions simplement à vous faire part d'un petit hic concernant votre enchère pour : ${product.productName}.<br/>Il semble qu'il y ait eu un petit souci avec le traitement de votre paiement. Pas de panique, ça peut arriver !<br/>
                          Cependant, en raison de ce petit contretemps, votre enchère n'a malheureusement pas pu être validée.<br/><br/>
                          Prenez juste quelques instants pour vérifier les détails de votre  mode de paiement et assurez-vous qu'elle est prête à être utiliser lors de vos prochaines enchères.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `Petite alerte au sujet de votre enchère : ${product.productName}`,
            html: template,
        });
    },
    sendWinningBidConfirmationEmail: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Félicitations ! Nous sommes ravis de vous informer que vous avez remporté l'enchère pour l'article : ${product.productName} sur Liveshopp ! 🎉<br/>
                          Vous pouvez désormais suivre l'avancement de la livraison de votre article directement depuis l'application, dans la section "Mes Commandes". Nous vous tiendrons informé(e) de chaque étape du processus.<br/><br/>
                          Encore une fois, félicitations pour votre victoire!<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `Félicitations ! Vous avez remporté l'enchère pour : ${product.productName}`,
            html: template,
        });
    },
    sendAuctionSaleNotificationEmail: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Félicitations ! Nous sommes heureux de vous informer que votre article a été vendu aux enchères avec succès sur Liveshop ! 🎉<br/>
                          Toutes les informations concernant cette vente sont disponibles dans la section "Mes Commandes" de l'application. N'oubliez pas de valider l'envoi de l'article dès que possible pour garantir une expérience optimale à l'acheteur.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: `Félicitations ! Votre article : ${product.productName} a été vendu sur Liveshopp`,
            html: template,
        });
    },
    sendNoShippingAddressEmail: async (customer, product) => {
        const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Nous tenons à vous informer que votre enchère pour l'article : ${product.productName} n'a pas pu être acceptée car vous n'avez pas spécifié d'adresse de livraison.<br/>
                          En conséquence, votre enchère a été annulée. Si vous souhaitez participer à d'autres enchères à l'avenir, veuillez vous assurer de fournir une adresse de livraison valide.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`

        await transporter.sendMail({
            from: '"Liveshopp" <application@liveshopp.fr>', // sender address
            to: customer.email, // list of receivers
            subject: "Enchère annulée",
            html: template,
        });
    },
};