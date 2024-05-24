const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    ciphers: 'SSLv3',
  },
  from: process.env.LIVESHOPP_EMAIL,
  secureConnection: true,
  auth: {
    user: process.env.LIVESHOPP_EMAIL, // generated ethereal user
    pass: process.env.LIVESHOPP_EMAIL_PASSWORD, // generated ethereal password
  },
});

const sendCodeToConfirmEmailRegistration = async (userEmail, code) => {
  const template = `<div>Bonjour,</div><br/>
                          <div>Votre code de confirmation Liveshopp est : </div><br/>
                          <b style="font-size: 25px">${code}</b><br/><br/>
                          <div>L'équipe Liveshopp 👋</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: userEmail, // list of receivers
    subject: 'Code de confirmation', // Subject line
    html: template,
  });
};
const sendCodeToResetPassword = async (userEmail, code) => {
  const template = `<div>Bonjour,</div><br/>
                          <div>Votre code de vérification Liveshopp est : </div><br/>
                          <b style="font-size: 25px">${code}</b><br/><br/>
                          <div>L'équipe Liveshopp 👋</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: userEmail, // list of receivers
    subject: 'Code de vérification', // Subject line
    html: template,
  });
};
const sendWelcomeEmail = async (customer) => {
  const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Nous sommes très heureux d’accueillir de nouveaux utilisateurs et pour ce faire, nous sommes disponibles pour toute question ou information dont vous auriez besoin à propos de l’application. <br/><br/> 
                          Liveshopp est l’app qui réunit la communauté de la mode en live et qui vous permet d’échanger en direct avec votre vendeur préféré, et de pouvoir faire de bonnes affaires en achetant l’article sur lequel vous avez eu un coup de coeur en un clic 😍<br/><br/> 
                          Pour bien débuter sur Liveshopp et pouvoir commencer à enchérir sur des articles pendant les lives, n’oubliez pas de renseigner : <br/><br/>
                          👍 : Votre adresse de livraison, qui sera utile au vendeur pour vous envoyer les articles <br/><br/>
                          ✌️ : Un moyen de paiement, qui vous permettra d’acheter en direct. <br/><br/>
                          Voilà ! Bons lives ${customer.firstname} 🔥 !<br/><br/>
                          Sofiane, fondateur chez Liveshopp</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: customer.email, // list of receivers
    subject: 'Bienvenue sur Liveshopp 👋!', // Subject line
    html: template,
  });
};
const sendNoBidNotificationEmail = async (auctionItem) => {
  const template = `<div>Bonjour ${auctionItem.seller_id.company_name},</div><br/>
                          <div>Nous souhaitions vous informer qu'à ce jour, aucune enchère n'a été placée sur votre article <strong>${auctionItem.productName}</strong>. Cependant, nous sommes heureux de constater que votre article a suscité un certain intérêt.<br/><br/> 
                          Nous vous encourageons à re-proposer l'article aux enchères, éventuellement avec un prix de départ légèrement inférieur. Nous serions ravis de vous accompagner tout au long de ce processus.<br/><br/> 
                          Si vous avez des questions ou besoin d'assistance supplémentaire, n'hésitez pas à nous contacter. Nous sommes là pour vous aider à chaque étape de la vente.<br/><br/>
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auctionItem.seller_id.email, // list of receivers
    subject: 'Aucune offre cette fois-ci.', // Subject line
    html: template,
  });
};
const sendNoReservePriceReachedNotificationEmail = async (customer, product) => {
  const template = `<div>Bonjour ${customer.company_name},</div><br/>
                          <div>Nous tenions à vous informer que les enchères pour votre article <strong>${product.productName}</strong> se sont terminées récemment, malheureusement, aucun enchérisseur n'a atteint le prix de réserve que vous avez fixé.</div><br/><br/> 
                          <div>Malgré cela, nous constatons que votre article a suscité un grand intérêt.<br/><br/> Si vous le souhaitez, nous vous encourageons à re-proposer l'article aux enchères avec un prix de réserve ajusté. Nous serions ravis de vous accompagner tout au long de ce processus.
                           L'équipe Liveshopp<br/> application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: customer.email, // list of receivers
    subject: 'Aucune offre au prix de réserve.', // Subject line
    html: template,
  });
};
const sendEmailAfterBid = async (customer, product) => {
  const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Votre offre actuelle d'un montant de <strong>${product.currentPrice} €</strong> pour l'article <strong>${product.productName}</strong> a bien été enregistrée et sera prise en compte à la clôture de l'enchère, sous réserve des conditions suivantes :<br/><br/> 
                          <strong>1.</strong> Elle égale ou dépasse le prix de réserve fixé par le vendeur.<br/> 
                          <strong>2.</strong> Aucune offre supérieure à la votre n'est soumise pendant la durée de l'enchère.<br/> 
                          <strong>3.</strong> Votre moyen de paiement est valide.<br/><br/> 
                          Si votre offre répond à ces critères, vous n'aurez rien à faire ! Le montant de votre offre sera automatiquement débité et vous recevrez un email de confirmation.<br/><br/>
                          Nous vous remercions pour votre confiance. Pour toute question supplémentaire, n'hésitez pas à nous contacter.<br/><br/>
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: customer.email, // list of receivers
    subject: 'Offre prise en compte.', // Subject line
    html: template,
  });
};
const sendEmailToInformOutbid = async (customer, product) => {
  const template = `<div>Bonjour ${customer.firstname},</div><br/>
                          <div>Nous tenions à vous informer qu'un autre utilisateur a dépassé votre offre dans l'enchère pour l'article <strong>${product.productName}</strong>. Ne vous laissez pas faire !<br/><br/> 
                          À vous de jouer !<br/> <br/> 
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: customer.email, // list of receivers
    subject: 'Vous avez été dépassé!', // Subject line
    html: template,
  });
};
const sendBidRejectedDueToLowReservePrice = async (auction) => {
  const template = `<div>Bonjour ${auction.userId.firstname},</div><br/>
                          <div>Malheureusement, votre offre sur l'article <strong>${auction.auctionItemId.productName}</strong> n'a pas été acceptée cette fois-ci car elle n'a pas réussi à atteindre le prix de réserve fixé par le vendeur.<br/><br/> 
                          Ne vous découragez pas ! Continuez de participer à nos enchères et qui sait, vous pourriez décrocher une pépite la prochaine fois !<br/><br/> 
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auction.userId.email, // list of receivers
    subject: "Oops! Votre offre n'a pas passé le cap.", // Subject line
    html: template,
  });
};
const sendPaymentIssueEmail = async (auction) => {
  const template = `<div>Bonjour ${auction.userId.firstname},</div><br/>
                          <div>Nous tenions simplement à vous faire part d'un petit hic concernant votre enchère pour l'article <strong>${auction.auctionItemId.productName}</strong>.<br/>Il semble qu'il y ait eu un petit souci avec le traitement de votre paiement.<br/>
                          En raison de ce petit contretemps, votre enchère n'a malheureusement pas pu être validée.<br/><br/>
                          Prenez juste quelques instants pour vérifier les détails de votre  mode de paiement et assurez-vous qu'elle est prête à être utiliser lors de vos prochaines enchères.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auction.userId.email, // list of receivers
    subject: 'Petite alerte au sujet de votre enchère.',
    html: template,
  });
};
const sendWinningBidConfirmationEmail = async (auction) => {
  const template = `<div>Bonjour ${auction.userId.firstname},</div><br/>
                          <div>Félicitations ! Nous sommes ravis de vous informer que vous avez remporté l'enchère pour l'article <strong>${auction.auctionItemId.productName}</strong> sur Liveshopp !<br/><br/>
                          Vous pouvez désormais suivre l'avancement de la livraison de votre article directement depuis l'application, dans la section <strong>Mes Commandes</strong> de l'application. Nous vous tiendrons informé(e) de chaque étape du processus de livraison.<br/><br/>
                          Encore une fois, félicitations pour votre acquisition !<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auction.userId.email, // list of receivers
    subject: "Vous avez remporté l'enchère 🎉",
    html: template,
  });
};
const sendAuctionSaleNotificationEmail = async (auctionItem, auction) => {
  const template = `<div>Bonjour ${auction.auctionItemId.sellerName},</div><br/>
                          <div>Félicitations ! Nous sommes heureux de vous informer que votre article <strong>${auction.auctionItemId.productName}</strong> a été vendu aux enchères avec succès sur Liveshopp 🎉<br/><br/>
                          Toutes les informations concernant la vente sont disponibles dans la section <strong>Mes Commandes</strong> de l'application. N'oubliez pas de valider l'envoi de l'article une fois expédié.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auctionItem.seller_id.email, // list of receivers
    subject: 'Votre article a été vendu 🎉',
    html: template,
  });
};
const sendNoShippingAddressEmail = async (auction) => {
  const template = `<div>Bonjour ${auction.userId.firstname},</div><br/>
                          <div>Nous tenons à vous informer que votre enchère pour l'article <strong>${auction.auctionItemId.productName}</strong> n'a pas pu être acceptée car vous n'avez pas spécifié d'adresse de livraison.<br/>
                          En conséquence, votre enchère a été annulée. Si vous souhaitez participer à d'autres enchères à l'avenir, veuillez vous assurer de fournir une adresse de livraison valide.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: auction.userId.email, // list of receivers
    subject: 'Enchère annulée.',
    html: template,
  });
};
const sendBidOutbidEmailNotification = async (email, auction) => {
  const template = `<div>Bonjour ${auction.userId.firstname},</div><br/>
                          <div>L'enchère sur l'article <strong>${auction.auctionItemId.productName}</strong> est maintenant terminée!<br/>
                          Bien que vous n'ayez pas décroché la victoire cette fois-ci, ne baissez pas les bras! Continuez à explorer les enchères pour dénicher des pépites sur LiveShopp.<br/><br/>
                          
                          L'équipe Liveshopp<br/>
                          application@liveshopp.fr</div>`;

  await transporter.sendMail({
    from: '"Liveshopp" <application@liveshopp.fr>', // sender address
    to: email, // list of receivers
    subject: 'Enchère Terminée.',
    html: template,
  });
};

module.exports = {
  sendAuctionSaleNotificationEmail,
  sendCodeToConfirmEmailRegistration,
  sendCodeToResetPassword,
  sendWelcomeEmail,
  sendNoShippingAddressEmail,
  sendBidOutbidEmailNotification,
  sendPaymentIssueEmail,
  sendWinningBidConfirmationEmail,
  sendBidRejectedDueToLowReservePrice,
  sendEmailAfterBid,
  sendNoReservePriceReachedNotificationEmail,
  sendEmailToInformOutbid,
  sendNoBidNotificationEmail,
};
