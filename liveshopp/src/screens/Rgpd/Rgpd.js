import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import colors from '../../styles/colors';

export const SettingNewLive = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}
                    contentInset={{bottom: 100}}>
                    <View style={styles.formContainer}>
                        <View style={styles.headlineContainerMessage}>
                            <View style={styles.rgpdContainerTitle}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 35,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                        paddingRight: 30

                                    }}>
                                    Conditions Générales d'utilisation et Conditions Générales de Vente.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    Préambule.
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp dont le siège
                                    social est situé 1 place jehan rictus, 93270, Sevran, enregistrée sous le
                                    status d'entreprise individuelle sous le numéro : 825 032 154 00023
                                    (ci-après « Liveshopp » ou « Nous ») propose une Plateforme
                                    qui permet notamment à des Acheteurs, après création d’un
                                    compte, d'acheter des Articles proposées par des Vendeurs
                                    Professionnels ou des Vendeurs Particuliers, inscrits sur la
                                    Plateforme, au cours de Ventes en Direct. Les présentes CGU
                                    ont pour objet de définir les modalités et conditions
                                    d’utilisation de la Plateforme ainsi que les droits et
                                    obligations des Utilisateurs dans ce cadre. Pour utiliser la
                                    Plateforme, les Utilisateurs s’engagent à prendre connaissance
                                    des CGU. En créant leur compte, les Utilisateurs acceptent
                                    expressément sans réserve les CGU et la Politique de
                                    Confidentialité.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                        marginTop: 50,
                                    }}>
                                    Définitions.
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Les termes indiqués ci-après ont la signification suivante :
                                    {'\n'}
                                    {'\n'}- Acheteur : désigne toute personne physique ayant la
                                    capacité d’accomplir des actes juridiques ainsi que toute
                                    personne morale de droit privé, qui n’agissent pas à des fins
                                    professionnelles, titulaires d’un compte client.{'\n'}
                                    {'\n'}- Articles : désignent les produits ajoutés par le
                                    Vendeur sur le Catalogue de la Plateforme aux fins de les
                                    vendre ou de les échanger.{'\n'}
                                    {'\n'}- Catalogue : désigne le catalogue électronique dans
                                    lequel les Articles du même type sont répertoriés.{'\n'}
                                    {'\n'}- CGU : désigne les présentes conditions générales
                                    d’utilisation, qui régissent les relations entre Liveshopp et
                                    les Utilisateurs, qu’ils soient, les Acheteurs ou Vendeurs.
                                    {'\n'}
                                    {'\n'}- CGV : désigne les conditions générales de vente qui
                                    régissent les relations entre un Vendeur et un Acheteur.{'\n'}
                                    {'\n'}- Compte Client : désigne l’inscription de l’Utilisateur
                                    sur la Plateforme en dehors de toute création d’un Compte
                                    Vendeur.{'\n'}
                                    {'\n'}- Compte Vendeur : désigne l’inscription de
                                    l’Utilisateur en tant que Vendeur sur la Plateforme.{'\n'}
                                    {'\n'}- Fiche Produit : désigne la description d’un Article,
                                    laquelle contient au moins le prix TTC exprimé en Euros, une
                                    description des caractéristiques essentielles de l’Article.
                                    {'\n'}
                                    {'\n'}- Plateforme : désigne le site Internet www.liveshopp.fr
                                    ainsi que les applications mobiles de la plateforme Liveshopp
                                    téléchargées sur smartphones ou tablettes.{'\n'}
                                    {'\n'}- Services : Mise à disposition d’outils permettant aux
                                    Vendeurs de se mettre en relation avec des Acheteurs, via des
                                    Ventes en Direct, afin de leur proposer des Articles à la
                                    vente, de référencer et de décrire ces Articles, d’accepter
                                    les commandes passées par les Acheteurs, de percevoir le prix
                                    des Articles achetés et de gérer le service après-vente pour
                                    les Articles vendus.{'\n'}
                                    {'\n'}- Service de Paiement Intégré : désigne le service de
                                    paiement en ligne accessible à l’Acheteur sur la Plateforme,
                                    tel que celui fourni par STRIPE FRANCE, SARL au capital de 1
                                    000€, dont le siège social est situé au 10 Boulevard Haussmann
                                    75009 PARIS 9 et immatriculée au RCS de Paris sous le numéro
                                    807 572 011.{'\n'}
                                    {'\n'}- Transaction : désigne toute transaction qui transfère
                                    la propriété et/ou le droit d'utiliser un Article, d’un
                                    Vendeur à un Acheteur, ou toute autre transaction effectuée
                                    entre les Utilisateurs.{'\n'}
                                    {'\n'}- Utilisateur : désigne tout utilisateur de la
                                    Plateforme, qu’il soit Acheteur, Vendeur Professionnel ou
                                    Vendeur Particulier.{'\n'}
                                    {'\n'}- Vendeur : désigne les Vendeurs Particuliers et/ou les
                                    Vendeurs Professionnels{'\n'}
                                    {'\n'}- Vendeur Particulier : désigne tout Utilisateur qui
                                    vend un ou plusieurs Article sur le Catalogue correspondant de
                                    la Plateforme en dehors du cadre de son activité
                                    professionnelle.{'\n'}
                                    {'\n'}- Vendeur Professionnel : désigne tout Utilisateur qui
                                    vend un ou plusieurs Articles au Catalogue correspondant de la
                                    Plateforme dans le cadre de son activité professionnelle. Les
                                    Vendeurs Professionnels peuvent être des sociétés
                                    commerciales, des entreprises individuelles ou des
                                    associations au sens de la loi du 1er juillet 1901, dûment
                                    enregistrées en France. Les Vendeurs Professionnels sont
                                    identifiés sur la Plateforme par une mention “Professionnel”
                                    affichée à côté de leur nom. {'\n'}
                                    {'\n'}- Vente en Direct : désigne la tenue d’une vente en
                                    direct, via le service de diffusion vidéo proposé par la
                                    Plateforme, au cours de laquelle un Vendeur propose un ou
                                    plusieurs articles à la vente auprès des utilisateurs
                                    connectés.{'\n'}
                                    {'\n'}
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    1 - Objet
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp est une plateforme en ligne qui donne aux
                                    Utilisateurs la possibilité technique d’acheter, de vendre des
                                    Articles, d’assister à des Ventes en Direct et de communiquer
                                    en envoyant des messages privés. Liveshopp propose uniquement
                                    des services facilitant les Transactions entre les Acheteurs
                                    et les Vendeurs Professionnels ou les Vendeurs Particuliers.
                                    Dès lors, Liveshopp n’est partie à aucune Transaction entre
                                    les Acheteurs et les Vendeurs Professionnels ou les Vendeurs
                                    Particuliers et n’achète, ne vend aucun des Articles présentés
                                    sur la Plateforme. La Plateforme permet aux Utilisateurs
                                    d’utiliser différents Services : {'\n'}
                                    {'\n'}- Acheter ou vendre des Articles entre Acheteurs et
                                    Vendeurs Professionnels ou Vendeurs Particuliers{'\n'}
                                    {'\n'}- Créer un Compte Client ou un Compte Vendeur{'\n'}
                                    {'\n'}- Bénéficier d’un service de messagerie et d’un forum
                                    afin de discuter entre Utilisateurs, ou de préciser certaines
                                    informations sur les Articles préalablement à leur vente, leur
                                    échange ou leur livraison{'\n'}
                                    {'\n'}- Bénéficier d’un service de Médiation Liveshopp
                                    facilitant les échanges entre un Acheteur et un Vendeur en cas
                                    de litige{'\n'}
                                    {'\n'}- Suivre un Vendeur ou une catégorie d’Articles
                                    spécifiques en cliquant sur l’onglet « Follow » afin d’être
                                    informé des actualités à venir concernant ledit Vendeur ou
                                    ladite catégorie d’Articles{'\n'}
                                    {'\n'}
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    2 - Accès aux servies - création d'un compte
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    L'accès aux Services est réservé à une utilisation strictement
                                    personnelle. Le Services est fourni sous réserve de
                                    l’acceptation des CGU et de la création d’un Compte Client.
                                    Pour créer un Compte Client, l’utilisateur doit être majeur,
                                    ou être un mineur bénéficiant de l’autorisation préalable de
                                    son ou ses représentants légaux et fournir les données
                                    permettant son identification. Si l’Utilisateur est mineur,
                                    son ou ses représentants légaux seront liés par les CGU et
                                    responsable(s) du Compte de l’Utilisateur. L’Utilisateur
                                    s’engage à ne fournir que des informations exactes et à
                                    informer Liveshopp sans délai de tout changement. Si vous êtes
                                    un Acheteur, pour l’ouverture d’un Compte Client, vous devez
                                    renseigner : {'\n'}
                                    {'\n'}- vos nom et prénom{'\n'}
                                    {'\n'}- une adresse électronique{'\n'}
                                    {'\n'}- un mot de passe{'\n'}
                                    {'\n'}
                                    Si vous êtes un Vendeur, pour l’ouverture d’un Compte Vendeur,
                                    vous devez communiquer :{'\n'}
                                    {'\n'}- vos nom et prénom{'\n'}
                                    {'\n'}- nom de l’entreprise{'\n'}
                                    {'\n'}- secteur d’activité de l’entreprise{'\n'}
                                    {'\n'}- rôle dans l’entreprise{'\n'}
                                    {'\n'}- une adresse électronique{'\n'}
                                    {'\n'}- un numéro de téléphone{'\n'}
                                    {'\n'}- Vos coordonnées bancaires afin que nous puissions
                                    procéder aux paiements des ventes effectuées Information
                                    permettant l’identification (numéro carte d’identité ou numéro
                                    fiscal) pour les vendeurs non-professionnels{'\n'}
                                    {'\n'}
                                    Pour utiliser les Services, l’Utilisateur doit utiliser
                                    l'identifiant et le mot de passe indiqués lors de la création
                                    du compte et s’engage à les conserver parfaitement secrets et
                                    à ne les divulguer à aucun tiers. Si l’Utilisateur crée un
                                    Compte en tant que Vendeur Particulier, mais que les
                                    informations communiquées permettent à Liveshopp de considérer
                                    que l’Utilisateur est un Vendeur Professionnel, Liveshopp est
                                    autorisé à vous contacter pour obtenir des informations
                                    supplémentaires et permettre de modifier le statut de Vendeur.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    Préambule.
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp S.A.S, société par actions simplifiée dont le siège
                                    social est situé 1 place jehan rictus, 93270, Sevran livry,
                                    (ci-après « Liveshopp » ou « Nous ») propose une Plateforme
                                    qui permet notamment à des Acheteurs, après création d’un
                                    compte, d'acheter des Articles proposées par des Vendeurs
                                    Professionnels ou des Vendeurs Particuliers, inscrits sur la
                                    Plateforme, au cours de Ventes en Direct. Les présentes CGU
                                    ont pour objet de définir les modalités et conditions
                                    d’utilisation de la Plateforme ainsi que les droits et
                                    obligations des Utilisateurs dans ce cadre. Pour utiliser la
                                    Plateforme, les Utilisateurs s’engagent à prendre connaissance
                                    des CGU. En créant leur compte, les Utilisateurs acceptent
                                    expressément sans réserve les CGU et la Politique de
                                    Confidentialité.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    3 - Obligation des utilisateurs
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    L’Utilisateur reconnaît avoir pris connaissance sur la
                                    Plateforme des caractéristiques et contraintes, notamment
                                    techniques, de l’ensemble des Services. Il est seul
                                    responsable de son utilisation des Services. L’Utilisateur est
                                    informé que la mise en œuvre des Services nécessite qu’il soit
                                    connecté à Internet et que la qualité des Services dépend
                                    directement de cette connexion, dont il est seul responsable.
                                    L’Utilisateur est seul responsable des informations qu’il
                                    communique dans le cadre des Services. Il lui appartient
                                    d’exercer la prudence et le discernement appropriés dans ces
                                    relations et communications. L’Utilisateur s’engage à
                                    respecter les lois et règlements en vigueur et à ne pas porter
                                    atteinte aux droits de tiers ou à l’ordre public et s’interdit
                                    notamment à ce titre :{'\n'}
                                    {'\n'}- d’utiliser les Services d’une manière contraire à
                                    l’ordre public ou aux bonnes mœurs et notamment en tenant des
                                    propos ou en diffusant des contenus injurieux, diffamatoires,
                                    obscènes, offensants, violents ou incitant à la consommation
                                    de tabac, d’alcool, à la violence, politiques, racistes,
                                    xénophobes, pornographiques ou portant atteinte d’une
                                    quelconque manière à quelque droit que ce soit, et ce, quelle
                                    qu’en soit la forme {'\n'}
                                    {'\n'}- d’avoir un comportement déplacé ou se livrer à du
                                    cyberharcèlement envers son interlocuteur{'\n'}
                                    {'\n'}- d’introduire des virus, cheval de Troie, ou un
                                    quelconque autre programme informatique malveillant ou
                                    nuisible ne pas enregistrer ou diffuser le contenu des
                                    conversations avec son interlocuteur{'\n'}
                                    {'\n'}- d’accéder frauduleusement à la Plateforme et aux
                                    Services ou d’en détourner la finalité{'\n'}
                                    {'\n'}- de publier des informations permettant
                                    l’identification de personnes physiques sans leur
                                    consentement, notamment leur nom de famille, adresse postale
                                    et/ou électronique, numéro de téléphone, photographie,
                                    enregistrement audio ou vidéo, ou de collecter et stocker des
                                    données personnelles afférentes aux autres Utilisateurs {'\n'}
                                    {'\n'}- de donner des informations renvoyant vers d’autres
                                    sites (que ce soit par la création de liens hypertextes ou par
                                    la simple fourniture d’informations) dont le contenu serait
                                    susceptible de contrevenir à toute loi ou réglementation en
                                    vigueur, et notamment serait susceptible de porter atteinte
                                    aux droits des personnes et des biens et/ou aux droits de
                                    propriété intellectuelle {'\n'}
                                    {'\n'}- de porter atteinte à des droits de tiers quels qu’ils
                                    soient, qu’il s’agisse de droits de propriété intellectuelle
                                    ou de tous autres droits. L’Utilisateur garantit à Liveshopp
                                    qu’il dispose de tous les droits et autorisations nécessaires
                                    à la diffusion de tous les contenus qu’il publie sur la
                                    Plateforme et s’engage à n’utiliser que des contenus pour
                                    lesquels il dispose des droits, ou pour lesquels le titulaire
                                    des droits a donné son consentement exprès pour leur
                                    diffusion, ou qui sont libres de tout droit.{'\n'}
                                    {'\n'}
                                    L’Utilisateur s’engage le cas échéant à indemniser Liveshopp
                                    de tout préjudice directement ou indirectement lié au
                                    non-respect de cette garantie. L’Utilisateur s’engage à faire
                                    un usage strictement personnel des Services. Il s’interdit en
                                    conséquence de céder, concéder ou transférer tout ou partie de
                                    ses droits ou obligations au titre des CGU à un tiers, de
                                    quelque manière que ce soit. L’Utilisateur s’engage à fournir
                                    à Liveshopp toutes les informations nécessaires à la bonne
                                    fourniture des Services. L’Utilisateur garantit que toutes les
                                    informations qu’il communique sont exactes, à jour et
                                    sincères, ne sont entachées d’aucun caractère trompeur et
                                    valent preuve de son identité. Plus généralement,
                                    l’Utilisateur s’engage à coopérer activement avec Liveshopp en
                                    vue de la bonne exécution des CGU. Le Vendeur s’engage à :{' '}
                                    {'\n'}
                                    {'\n'}- Vendre uniquement les Articles authentiques sur la
                                    Plateforme{'\n'}
                                    {'\n'}- Ne pas émettre d’offre ou enchérir sur ses propres
                                    Ventes en Direct{'\n'}
                                    {'\n'}- Respecter le contrat conclu avec l’Acheteur{'\n'}
                                    {'\n'}- Livrer les Articles conformément aux engagements pris
                                    durant la Vente en Direct dans le délai maximal fixé par
                                    Liveshopp ( 2 semaines ) maximum.{'\n'}
                                    {'\n'}- Répondre aux demandes des Acheteurs ou de Liveshopp
                                    concernant les ventes déjà effectuées dans le délai maximal
                                    indiqué par Liveshopp{'\n'}
                                    {'\n'}- Rembourser l’Acheteur en cas de litige résolu en
                                    faveur de l’Acheteur{'\n'}
                                    {'\n'}- Indiquer aux Utilisateurs son statut de Vendeur
                                    Professionnel ou de Vendeur Particulier. Il est rappelé que le
                                    fait pour un Vendeur Professionnel de se présenter en tant que
                                    Vendeur Particulier constitue une pratique commerciale
                                    trompeuse sanctionnée au titre de l’article L. 132-2 du Code
                                    de la consommation d’une peine d’emprisonnement de deux ans et
                                    d'une amende de 300 000 euros pour les personnes physiques et
                                    de 1 500 000 euros pour les personnes morales{'\n'}
                                    {'\n'}- Respecter, si vous êtes un Vendeur Professionnel,
                                    l’ensemble des obligations imposées au titre de la loi n°
                                    2020-205 du 10 février 2020, parmi lesquelles la
                                    responsabilité élargie du producteur visé aux articles L.
                                    541-10 et suivants du Code de l’Environnement et notamment
                                    être membre d’un éco-organisme agréé et verser à cet organisme
                                    une écocontribution correspondant au nombre et au type
                                    d’Articles vendus, obtenir un identifiant unique auprès de
                                    l'autorité administrative compétente et transmettre à
                                    Liveshopp chaque identifiant unique transmis par chaque
                                    éco-organisme auprès duquel le Vendeur est adhérent,
                                    transmettre à Liveshopp toutes les informations nécessaires
                                    pour permettre à Liveshopp de tenir le registre prévu par
                                    l’article L. 541-10-9 du Code de l’environnement et proposer
                                    la reprise sans frais des Articles usagés au point de
                                    livraison de l’Article produit vendu, ou auprès d'un point de
                                    collecte de proximité lorsqu'il s'agit de produits
                                    transportables sans équipement.{'\n'}
                                    {'\n'}
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    4 - Vente d'un article
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Les Vendeurs doivent disposer d'un Compte Vendeur pour mettre
                                    un Article en vente conformément aux CGV.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    5 - Achat d'un article
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Pour pouvoir acheter un Article, l’Acheteur doit disposer d’un
                                    Compte Client. La Plateforme permet aux utilisateurs d'acheter
                                    des Articles auprès des Vendeurs lors de Ventes en Direct, aux
                                    enchères en conformité avec les CGV. Pour enchérir, vous devez
                                    avoir préalablement renseigné votre adresse de livraison et
                                    renseigné votre mode de paiement.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    6 - Prix des services
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Si vous êtes un Acheteur Les Services sont fournis aux
                                    Acheteurs à titre gratuit.{'\n'}
                                    Si vous êtes un Vendeur{'\n'}
                                    Les Services fournis aux Vendeurs sont payants.{'\n'}
                                    Le Service de Paiement Intégré reversera au Vendeur le montant
                                    total du prix de la commande considérée, duquel seront
                                    déduites la commission perçue par Liveshopp et celle perçue
                                    par le Service de Paiement Intégré, après confirmation par
                                    l'Acheteur de sa réception, ainsi que le montant de la TVA
                                    lorsque Liveshopp a l’obligation légale de collecter la TVA.
                                    Ce versement sera effectué par virement sur le compte bancaire
                                    dont les coordonnées ont été renseignées par le Vendeur au
                                    sein de son Compte Vendeur.{'\n'}A défaut de confirmation de
                                    la réception de l’Article par l'Acheteur, l’Article sera
                                    réputé avoir été reçu 30 jours suivant la date d’expédition
                                    effective.{'\n'}
                                    Lorsque le Vendeur en fait la demande, Liveshopp fournit aux
                                    Vendeurs les factures correspondant à ces commissions.{'\n'}
                                    Il est de la responsabilité du Vendeur de payer tous les frais
                                    et taxes applicables résultant de la vente d'Articles sur la
                                    Plateforme.{'\n'}
                                    Liveshopp est autorisé à modifier le montant de la commission,
                                    sous réserve d’en informer les Vendeurs en respectant un
                                    préavis de 7 jours. En cas de refus de cette modification, le
                                    Vendeur Professionnel ou le Vendeur Particulier peut clôturer
                                    son compte à tout moment.{'\n'}
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    7 - Résponsbailité de Liveshopp
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp s’engage à fournir les Services avec diligence,
                                    étant précisé qu’il pèse sur elle une obligation de moyens, à
                                    l’exclusion de toute obligation de résultat, ce que les
                                    Utilisateurs reconnaissent et acceptent expressément.
                                    Liveshopp n’a pas connaissance des contenus mis en ligne par
                                    les Utilisateurs dans le cadre des Services, sur lesquels elle
                                    n’effectue aucune modération, sélection, vérification ou
                                    contrôle d’aucune sorte et à l’égard desquels elle
                                    n’intervient qu’en tant que prestataire d’hébergement. En
                                    conséquence, Liveshopp ne peut être tenue pour responsable des
                                    contenus dont les auteurs sont des Utilisateurs ou des tiers,
                                    toute réclamation éventuelle devant être dirigée vers l’auteur
                                    des contenus en question. Les contenus préjudiciables à un
                                    tiers peuvent faire l’objet d’une notification à Liveshopp
                                    selon les modalités prévues par l’article 6, I, 5° de la loi
                                    n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie
                                    numérique, Liveshopp se réservant de prendre les mesures
                                    décrites à l’article 8 des CGU. Liveshopp s’engage à procéder
                                    régulièrement à des contrôles afin de vérifier le
                                    fonctionnement et l’accessibilité de la Plateforme. A ce
                                    titre, Liveshopp se réserve la faculté d’interrompre
                                    momentanément l’accès à la Plateforme pour des raisons de
                                    maintenance. De même, Liveshopp ne saurait être tenue
                                    responsable des difficultés ou impossibilités momentanées
                                    d’accès à la Plateforme qui auraient pour origine des
                                    circonstances qui lui sont extérieures, la force majeure, ou
                                    encore qui seraient dues à des perturbations des réseaux de
                                    télécommunication. Liveshopp ne garantit pas aux Utilisateurs
                                    que les Services seront totalement exempts d’erreurs, de vices
                                    ou défauts, que les Services, étant standards et nullement
                                    proposés à la seule intention d’un Utilisateur donné en
                                    fonction de ses propres contraintes personnelles, répondront
                                    spécifiquement à ses besoins et attentes. En tout état de
                                    cause, sauf règles impératives contraires, la responsabilité
                                    susceptible d’être supportée par Liveshopp au titre des CGU
                                    est expressément limitée aux seuls dommages directs avérés
                                    subis par l’Utilisateur, à l'exclusion de tous dommages
                                    indirects et de toute perte de bénéfices, perte de contrat,
                                    perte de chiffre d’affaires, manque à gagner ou atteinte à la
                                    réputation découlant ou en lien avec les présentes.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    8 - Résiliation
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    En cas de manquement par un Utilisateur à l’une quelconque des
                                    stipulations des CGU ou, plus généralement, d’infraction aux
                                    lois et règlements en vigueur, Liveshopp se réserve le droit
                                    de prendre toute mesure appropriée et notamment : {'\n'}
                                    {'\n'}- supprimer tout contenu mis en ligne sur la Plateforme
                                    {'\n'}
                                    {'\n'}- envoyer un avertissement à l’Utilisateur auteur du
                                    manquement ou de l’infraction, ou y ayant participé{'\n'}
                                    {'\n'}- limiter l’utilisation des Services par l’Utilisateur
                                    auteur du manquement ou de l’infraction, ou y ayant participé
                                    {'\n'}
                                    {'\n'}- suspendre de plein droit temporairement l’accès aux
                                    Services de l’Utilisateur, auteur du manquement ou de
                                    l’infraction, ou y ayant participé{'\n'}
                                    {'\n'}- résilier définitivement, immédiatement et de plein
                                    droit l’accès aux Services de l’Utilisateur, auteur du
                                    manquement ou de l’infraction, ou y ayant participé notamment
                                    si l'Utilisateur{'\n'}
                                    {'\n'}- a transféré son Compte Client ou son Compte Vendeur ou
                                    en a donné l'accès à des tiers{'\n'}
                                    {'\n'}- cause un dommage aux autres Utilisateurs ou à
                                    Liveshopp{'\n'}
                                    {'\n'}- a commis un manquement aux CGU{'\n'}
                                    {'\n'}- a enfreint les conditions d'utilisation du Service de
                                    Paiement Intégré{'\n'}
                                    {'\n'}- avertir toute autorité concernée{'\n'}
                                    {'\n'}- engager toute action judiciaire{'\n'}
                                    {'\n'}
                                    Chaque Utilisateur peut clôturer son Compte Acheteur ou son
                                    Compte Vendeur à tout moment. Si vous êtes un Vendeur
                                    Liveshopp notifiera au Vendeur par courrier électronique, la
                                    décision de suspension ou de résiliation incluant un exposé
                                    des motifs justifiant la décision, afin de mettre le Vendeur
                                    en mesure de clarifier les faits et les circonstances ayant
                                    entrainé la suspension ou la résiliation. Cette notification
                                    interviendra au plus tard 30 jours avant la prise d’effet de
                                    la décision. En cas de suspension ou de résiliation de l’accès
                                    de l’Utilisateur aux Services, l’Utilisateur ne peut plus
                                    utiliser les Services, et ce même avec d'autres comptes
                                    Liveshopp et ne peut plus créer de nouveaux comptes.
                                    L’Utilisateur est en droit de solliciter des justifications
                                    sur les faits et circonstances qui motivent ces mesures dans
                                    le cadre de la procédure interne de traitement des plaintes de
                                    Liveshopp en envoyant un courrier électronique à l’adresse
                                    suivante : application@liveshopp.fr Aucune des sanctions
                                    visées ci-dessus n’a d’effet sur la validité des contrats déjà
                                    conclus sur la Plateforme.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    9 - Classement - Référencement - Déréferencement
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    9.1 Classement {'\n'}
                                    {'\n'}
                                    Les Ventes en direct sur la Plateforme sont classées selon les
                                    modalités suivantes : {'\n'}
                                    {'\n'}- Les Ventes en cours (en France) {'\n'}
                                    {'\n'}- Les Ventes à venir (en France) {'\n'}
                                    {'\n'}
                                    Les Utilisateurs peuvent également modifier ce classement en
                                    suivant un Vendeur ou un type d’Article spécifique, qui
                                    apparaîtra en tête du classement des Articles ou des Ventes,
                                    ou sélectionnant un critère de tri différent selon le type
                                    d’Articles vendus (par exemple la catégorie Sports ou Mangas).
                                    Aucun Vendeur ne dispose de liens capitalistiques avec
                                    Liveshopp ou de rémunération de Liveshopp susceptibles
                                    d’influencer le référencement ou le classement des contenus ou
                                    des Articles sur la Plateforme. Si tel est le cas, une
                                    information serait fournie aux Utilisateurs par la mention «
                                    sponsorisé » apparaissant dans les pages de résultat, à côté
                                    de certains Vendeurs ou certains Articles.{'\n'}
                                    {'\n'}
                                    9.2 Référencement{'\n'}
                                    {'\n'}
                                    Liveshopp priorise l’intégration des Vendeurs souhaitant être
                                    présents sur la Plateforme, afin d’assurer une offre variée
                                    sur la Plateforme. La Plateforme ayant une capacité d’accueil
                                    de vendeurs déterminée, Liveshopp intègre progressivement les
                                    Vendeurs souhaitant être présents sur la Plateforme afin
                                    d’assurer une offre variée sur la Plateforme tant s’agissant
                                    des Articles disponibles (catégorie, prix) que du profil des
                                    Vendeurs actifs (localisation, disponibilité). Liveshopp ne
                                    procède toutefois à aucune sélection.{'\n'}
                                    {'\n'}- Les critères de priorisation sont les suivants{'\n'}
                                    {'\n'}- types d’Articles vendus{'\n'}
                                    {'\n'}- valeurs des Articles{'\n'}
                                    {'\n'}- horaires préférentiels des Ventes{'\n'}
                                    {'\n'}- localisation{'\n'}
                                    {'\n'}
                                    9.3 Déréférencement{'\n'}
                                    {'\n'}
                                    Les offres d’un Vendeur sont déréférencées de la Plateforme
                                    lorsque celui-ci décide de la fermeture de son Compte Vendeur.
                                    Les Vendeurs peuvent également dépublier un ou plusieurs live
                                    à leur convenance. En cas de violation par un Vendeur des CGU,
                                    des CGV ou d’une quelconque obligation légale ou
                                    règlementaire, Liveshopp se réserve le droit de dépublier tout
                                    ou partie du catalogue du Vendeur et, le cas échéant, de
                                    mettre fin de plein droit à la relation contractuelle la liant
                                    à ce dernier.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    10 - Mediation Liveshopp
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    En cas de litige entre un Acheteur et un Vendeur lors d'une
                                    Transaction, et notamment en cas de réception d’un Article
                                    non-conforme ou contrefait ou de non-réception d’un Article la
                                    Médiation Liveshopp facilite la communication entre les
                                    Acheteurs et les Vendeurs et participe à la recherche d’une
                                    solution amiable. Dans un délai de dix (10) jours à compter de
                                    la notification du litige par l’Acheteur au service de support
                                    Liveshopp, et si le litige n’a pas fait l’objet d’une
                                    résolution amiable directement entre l’Acheteur et le Vendeur
                                    dans le délai susvisé, Liveshopp servira d’interface entre
                                    l’Acheteur et le Vendeur afin de tenter de trouver une
                                    solution au problème remonté. Le Vendeur accepte de se
                                    conformer aux règles de la Médiation Liveshopp et autorise à
                                    prendre la décision finale dans tout litige. Si la décision
                                    finale est favorable à l’Acheteur, le Vendeur s’engage à
                                    rembourser les montants dus à l'Acheteur. La Médiation
                                    Liveshopp ne peut être assimilée à une garantie d’un Article.
                                    Il s'agit d'un service supplémentaire fourni par Liveshopp aux
                                    Utilisateurs et qui ne se substitute pas aux garanties légales
                                    prévues par le Code de la consommation ou le Code civil.
                                    Indépendamment de l'applicabilité de la Médiation Liveshopp
                                    les Acheteurs peuvent exercer leurs droits contre le Vendeur
                                    en vertu des dispositions légales.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    11 - Propriété intellectuelle et contenue
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Les systèmes, logiciels, structures, infrastructures, bases de
                                    données et contenus de toute nature (textes, images, visuels,
                                    musiques, logos, marques, base de données, etc.) exploités par
                                    Liveshopp au sein de la Plateforme sont protégés par des
                                    droits de propriété intellectuelle. Tous désassemblages,
                                    décompilations, décryptages, extractions, réutilisations,
                                    copies et plus généralement, tout acte de reproduction,
                                    représentation, diffusion et/ou utilisation de l’un quelconque
                                    de ces éléments, en tout ou partie, sans l’autorisation écrite
                                    et préalable de Liveshopp sont strictement interdits et
                                    pourront faire l’objet de poursuites judiciaires. Lorsque le
                                    Vendeur fournit du contenu sur la Plateforme au travers de la
                                    création d’annonces ou de la tenue de Vente en Direct, y
                                    compris tout contenu mis en ligne par les Services, le Vendeur
                                    consent concède à Liveshopp à titre non exclusif, gratuit,
                                    pour toutes les langues, pour le monde entier et pour la durée
                                    légale des droits (y compris les éventuelles prolongations qui
                                    pourraient intervenir), l'ensemble des droits à l'image et de
                                    propriété intellectuelle afférant audit contenu et aux
                                    éléments entrant dans sa composition (notamment textes,
                                    images, photographies, logos, illustrations, marques, modèles,
                                    titres, données), y compris toute base de données et tout
                                    contenu pouvant être qualifié d'œuvre dérivée. Ces droits
                                    comprennent le droit de reproduire, publier, représenter,
                                    diffuser, adapter, modifier, traduire, sous-licencier et
                                    communiquer au public, utiliser dans une base de données, pour
                                    tout ou partie des contenus par tous les procédés, sur tous
                                    les formats et supports (numérique, imprimé…) connus ou
                                    inconnus à ce jour, dans tous langages. En utilisant la
                                    Plateforme, les Utilisateurs consentent à ne pas utiliser le
                                    contenu du catalogue d'une manière qui porterait atteinte aux
                                    droits de propriété ou autre d'un tiers, ni pour créer des
                                    œuvres dérivées utilisant ces données ou informations quelles
                                    qu'elles soient (autres que pour la seule fin d'inclure ces
                                    informations dans les Annonces des Vendeurs). En particulier,
                                    les Vendeurs s’engagent à vérifier que les informations
                                    associées à leurs annonces sont exactes et à ne retirer aucune
                                    mentions ou signe indiquant la propriété (ex. « copyright », «
                                    marque déposée » …).
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    12 - Protection des données personnelle
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Le Vendeur Professionnel et Liveshopp sont amenés à traiter
                                    des données à caractère personnel concernant les Acheteurs
                                    dans le cadre et/ou en relation avec les CGU et les CGV,
                                    chacun agissant en tant que responsable de traitement distinct
                                    et indépendant. En particulier, Liveshopp agit comme
                                    responsable de traitement indépendant pour la gestion de la
                                    plateforme et le suivi de la relation avec les Utilisateurs et
                                    les Vendeurs Professionnels agissent comme responsable de
                                    traitement indépendant pour la livraison des Articles. En
                                    aucun cas, Liveshopp et le Vendeur Professionnel ne traitent
                                    des données personnelles en vertu et/ou en relation avec les
                                    CGU et les CGV en tant que responsables de traitement
                                    conjoints ou dans le cadre d'une relation de responsable de
                                    traitement à sous-traitant. Par conséquent, Liveshopp et le
                                    Vendeur Professionnel sont individuellement et séparément
                                    responsables du respect des obligations qui leur incombent en
                                    tant que responsable de traitement en vertu des lois
                                    applicables en matière de protection des données. Le Vendeur
                                    Professionnel doit se conformer aux obligations qui lui
                                    incombent en vertu des lois applicables en matière de
                                    protection des données (y compris, notamment, le règlement
                                    (UE) 2016/679 (Règlement général européen sur la protection
                                    des données "RGPD") et des lois complémentaires de l'Union
                                    européenne et locales sur la protection des données, comme la
                                    loi Informatique et Libertés du 6 janvier 1978 telle que
                                    modifiée. Cela inclut le cas échéant l'obligation de fournir
                                    des garanties appropriées pour le transfert de données
                                    personnelles vers un pays tiers à l’UE. Le Vendeur
                                    Professionnel s’engage à traiter les données personnelles
                                    reçues de Liveshopp exclusivement pour la ou les finalité(s)
                                    pour laquelle/lesquelles il les a reçues en vertu de et/ou en
                                    relation avec les CGU et les CGV. Le Vendeur Professionnel
                                    devra effacer les données à caractère personnel reçues dans le
                                    cadre des présentes Conditions d'utilisation immédiatement
                                    après que la ou les finalités respectives ont été atteintes.
                                    Tout traitement ultérieur des données personnelles n'est pas
                                    autorisé, sauf si la loi l'exige (par exemple, si une
                                    obligation de conservation s'applique). Le non-respect des
                                    obligations susmentionnées peut entraîner des mesures
                                    disciplinaires pouvant aller jusqu'à la suspension de votre
                                    compte. Pour en savoir plus sur la gestion de vos données
                                    personnelles par le Vendeur Professionnel et pour exercer vos
                                    droits, nous vous invitons à consulter directement leur
                                    politique de protection des données personnelles.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    13 - Cookies
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp est susceptible de placer des cookies sur la
                                    Plateforme. Pour plus d’informations sur les caractéristiques
                                    et la gestion de ces cookies, l’Utilisateur est expressément
                                    invité à prendre connaissance de la Politique de Cookies
                                    accessible (ici).
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    14 - Contact
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Pour toute demande, question ou réclamation, l’Utilisateur
                                    peut joindre le Service Client à l’adresse électronique
                                    suivante: application@liveshopp.fr
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    15 - Opposition au demarchage téléphonique
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Si le numéro de téléphone de l’Utilisateur est collecté par
                                    Liveshopp, l’Utilisateur peut s’enregistrer sur la liste
                                    d'opposition au démarchage téléphonique disponible sur
                                    http://www.bloctel.gouv.fr.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    16 - Archivage du contrat
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp conserve et archive pendant une durée de dix ans
                                    tout contrat conclu avec l’Utilisateur. L’Utilisateur sera en
                                    mesure d'y accéder à tout moment. Ce droit d'accès peut être
                                    exercé en contactant : application@liveshopp.fr
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    17 - Publicité
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp se réserve la faculté d’insérer sur toute page de la
                                    Plateforme et dans toute communication aux Utilisateurs tous
                                    messages publicitaires ou promotionnels sous une forme et dans
                                    des conditions dont Liveshopp sera seule juge.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    18 - Liens et sites tiers
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp ne pourra en aucun cas être tenue pour responsable
                                    de la disponibilité technique de sites internet ou
                                    d’applications mobiles exploités par des tiers (y compris ses
                                    éventuels partenaires) auxquels l’Utilisateur accéderait par
                                    l'intermédiaire de la Plateforme. Liveshopp n'endosse aucune
                                    responsabilité au titre des contenus, publicités, Articles
                                    et/ou services disponibles sur de tels sites et applications
                                    mobiles tiers, dont il est rappelé qu’ils sont régis par leurs
                                    propres conditions d’utilisation.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    19 - Modifiation
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp se réserve la possibilité de modifier les CGU. Les
                                    modifications prendront effet dans à la date ou dans le délai
                                    indiqué par Liveshopp mais ne s'appliqueront pas aux
                                    Transactions en cours au moment de leur entrée en vigueur.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    20 - Langue
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Dans l’hypothèse d’une traduction des CGU dans une ou
                                    plusieurs langues, la langue d’interprétation sera la langue
                                    française en cas de contradiction ou de contestation sur la
                                    signification d’un terme ou d’une stipulation.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    21 - Loi applicable et réglement des litiges
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Les CGU sont régies par le droit français. A titre
                                    d’information, veuillez noter que les CGU s’appliqueront à
                                    tout Utilisateur se connectant sur la page française de la
                                    Plateforme ou tout Utilisateur résident français et/ou auquel
                                    le droit français serait par ailleurs applicable, dans la
                                    limite la plus étendue permise par la loi.{'\n'}
                                    {'\n'}- Lorsque l’Utilisateur est un Vendeur Professionnel :
                                    en cas de litige découlant de la validité, la conclusion,
                                    l'interprétation, l'exécution ou la cessation des CGU, le
                                    Tribunal de Commerce de Paris aura compétence exclusive.{' '}
                                    {'\n'}
                                    {'\n'}- Lorsque l’Utilisateur est Acheteur ou Vendeur
                                    Particulier : {'\n'}
                                    {'\n'}
                                    L’Utilisateur a la possibilité de saisir les services d’un
                                    médiateur pour régler amiablement le litige avec Liveshopp.
                                    L’Utilisateur devra informer Liveshopp sans délai de cette
                                    demande. La solution proposée par le service de médiation ne
                                    s’impose ni à l’Utilisateur ni à Liveshopp. Conformément à
                                    l’article 14 du Règlement (UE) n° 524/2013, la Commission
                                    Européenne a mis en place une plateforme de Règlement en Ligne
                                    des Litiges, facilitant le règlement indépendant par voie
                                    extrajudiciaire des litiges en ligne entre consommateurs et
                                    professionnels de l’Union européenne. Cette plateforme est
                                    accessible au lien suivant : https://webgate.ec.europa.eu/odr/
                                    Tout litige relatif à la validité, la conclusion,
                                    l'interprétation, l'exécution ou la cessation des CGU pourra
                                    être soumis aux juridictions compétentes.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    22 - Stipulations générales
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Si l’une des stipulations des CGU est nulle ou réputée non
                                    écrite, les autres stipulations demeureront applicables.{' '}
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    23 - Conditions générales de vente
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Les présentes Conditions Générales de Vente (ci-après les
                                    "CGV") complètent les CGU. Tous les termes en majuscule
                                    utilisés dans les CGV sont définis dans les CGU. Les CGV
                                    s'appliquent à toutes les ventes d’Article, entre le Vendeur
                                    et l'Acheteur, réalisées sur la Plateforme via le Service. Les
                                    CGV régissent la relation entre les Vendeurs et les Acheteurs
                                    d’Articles. Liveshopp ne peut en aucun cas être considéré
                                    comme Vendeur. Seul le Vendeur, dont le nom est indiqué lors
                                    de la vente en directe, est le cocontractant de l'Acheteur
                                    dans le cadre de la Transaction. .{'\n'}
                                    {'\n'}- COMMANDE ET CONCLUSION DU CONTRAT DE VENTE{'\n'}
                                    {'\n'}
                                    Les Articles sont présentés sur la Plateforme par les Vendeurs
                                    lors des Ventes en Direct. L’Acheteur est informé, via le
                                    live, des caractéristiques essentielles et du prix de
                                    l’Article. le Vendeur détermine la mise à prix, c’est-à-dire
                                    le montant minimal devant être ajouté par chaque Acheteur pour
                                    enchérir, et le temps de la Vente en Direct. Le Vendeur est
                                    seul responsable de l'exactitude et l'exhaustivité de la
                                    description de l'Article dans la Fiche Produit ou pendant la
                                    Vente en Direct ainsi que de la conformité de l’Article à la
                                    description fournie dans la Fiche Produit et durant la Vente
                                    en Direct. Lors de la Vente en Direct, l’Acheteur peut
                                    enchérir au prix qu’il souhaite payer pour l'achat de
                                    l’Article présenté, jusqu'à l'expiration du temps imparti par
                                    le Vendeur pour l'enchère. L’Article est considéré comme vendu
                                    lorsqu’à l’expiration du temps imparti, l’Acheteur est le
                                    meilleur offreur Si l’Acheteur perd l'enchère, aucune demande
                                    de paiement n'est effectuée. Si l’Acheteur remporte l'enchère,
                                    la commande est automatiquement passée et communiquée au
                                    Vendeur. Chaque commande d'un Article constitue un contrat
                                    entre le Vendeur et l'Acheteur. Ce contrat sera formé lors de
                                    la réception par l'Acheteur d’un courrier électronique de
                                    confirmation de commande et implique l’obligation pour
                                    l’Acheteur de payer le prix indiqué et l’obligation pour le
                                    Vendeur de livrer l’Article.{'\n'}
                                    {'\n'}- PRIX ET PAIEMENT {'\n'}
                                    {'\n'}
                                    Le prix de vente des Articles ou la mise à prix sont définis
                                    librement par le Vendeur, dans le respect des lois et
                                    règlements en vigueur. Ces informations doivent être
                                    mentionnées sur la Plateforme et la Fiche Produit toutes taxes
                                    comprises, hors frais de livraison et frais compris. Lors de
                                    l’Achat, à l’issue d’une Vente, une demande de paiement est
                                    effectuée sur le moyen de paiement renseigné par l’Acheteur
                                    sur son Compte Client. Tout défaut de paiement entrainera
                                    l’annulation de la commande. Les paiements sur la Plateforme
                                    sont traités par le Service de Paiement Intégré, prestataire
                                    de paiement agréé pour l’encaissement pour compte de tiers.
                                    Les Vendeurs doivent créer un compte au sein du Service de
                                    Paiement Intégré conformément au processus communiqué par
                                    Liveshopp. Les paiements des Acheteurs sont effectués en
                                    ligne, au moyen de la carte bancaire enregistrée auprès du
                                    Service de Paiement Intégré et collectés par le Service de
                                    Paiement Intégré, qui les transfère aux Vendeurs, après
                                    déduction des commissions dues Liveshopp et au Service de
                                    Paiement Intégré. Les informations de paiement de l'Acheteur
                                    ne sont jamais communiquées aux Vendeurs. Lorsque les Articles
                                    sont expédiés de l'étranger, l’Acheteur peut être tenu au
                                    paiement de frais de douanes ou autres taxes d’importation
                                    afin de récupérer l’Article. Liveshopp n’est en aucun cas
                                    importateur des marchandises.{'\n'}
                                    {'\n'}- LIVRAISON ET RETOURS{'\n'}
                                    {'\n'}
                                    Les frais de livraison sont fixés par les Vendeurs, en
                                    fonction de leur solution de transport et sont à la charge de
                                    l’Acheteur. Les Articles sont livrés par le Vendeur à
                                    l’adresse indiquée par l’Acheteur lors de sa commande.
                                    L’Acheteur est informé que les Articles ne pourront lui être
                                    livrés que si : {'\n'}
                                    {'\n'}- le Vendeur propose la livraison dans le pays de
                                    destination indiqué dans l’adresse de livraison renseignée par
                                    l’Acheteur lors de sa commande - l’Acheteur dispose d’une
                                    adresse de livraison valide dans le pays de destination
                                    indiqué dans l’adresse de livraison renseignée par l’Acheteur
                                    lors de sa commande.{'\n'}
                                    {'\n'}
                                    Le Vendeur informe l’Acheteur par courrier électronique de
                                    l’expédition de l’Article, dans le respect des dates ou délais
                                    de livraison annoncés par le Vendeur à l’Acheteur lors de sa
                                    commande. Lors de la réception de l’Article, l’Acheteur doit
                                    vérifier l’état de l’Article dès réception afin de pouvoir
                                    confirmer sa conformité avec la commande. Lorsque la
                                    vérification de l’Article est possible au moment de la
                                    livraison, l’Acheteur doit immédiatement émettre des réserves
                                    sur l’état du colis et de l’Article, auprès du transporteur si
                                    l’Article ou son emballage a été abîmé lors du transport. En
                                    cas de retard, de non-réception totale ou partielle de
                                    l’Article commandé, l’Acheteur est invité à prendre contact
                                    avec le Vendeur à compter de la date de livraison convenue. Si
                                    le litige persiste, l’Acheteur peut prendre contact avec
                                    Liveshopp dans le cadre de la Médiation Liveshopp telle que
                                    détaillée en Article 10 des CGU. En cas de colis en souffrance
                                    (« non réclamé » ou « n’habite pas à l’adresse indiquée »)
                                    entrainant un retour de l’Article au Vendeur, l’Acheteur est
                                    remboursé du prix de l’Article (hors frais de livraison). Les
                                    frais de retour restent à la charge de l’Acheteur.{'\n'}
                                    {'\n'}
                                    DROIT DE RÉTRACTATION{'\n'}
                                    {'\n'}
                                    L’Acheteur bénéficie d’un droit de rétractation conformément
                                    au Code de la consommation, s’il effectue un achat auprès d’un
                                    Vendeur Professionnel, ou auprès d’un Vendeur Particulier qui
                                    décide d’offrir un tel droit. Dans cette dernière hypothèse,
                                    le Vendeur doit l’indiquer dans l’annonce proposant l’Article
                                    à la vente et/ou sur son profil. Si le droit de rétractation
                                    est applicable, l’Acheteur peut l’exercer auprès du Vendeur
                                    dans un délai de quatorze (14) jours à compter du jour où
                                    l’Acheteur ou un tiers désigné par lui autre que le
                                    transporteur prend physiquement possession de l’Article. Dans
                                    le cas d'une commande portant sur plusieurs Articles livrés
                                    séparément ou dans le cas d'une commande d'un Article composé
                                    de lots ou de pièces multiples dont la livraison est
                                    échelonnée sur une période définie, le délai court à compter
                                    de la date à laquelle l’Acheteur ou un tiers désigné par lui
                                    autre que le transporteur prend physiquement possession du
                                    dernier Article ou du dernier lot ou de la dernière pièce. Le
                                    jour de la réception n'est pas compté dans le délai de
                                    quatorze (14) jours. Le délai commence à courir au début de la
                                    première heure du premier jour et prend fin à l'expiration de
                                    la dernière heure du dernier jour du délai. Si le délai expire
                                    un samedi, un dimanche ou un jour férié ou chômé, il est
                                    prorogé jusqu'au premier jour ouvrable suivant. L’Acheteur n’a
                                    pas l’obligation de justifier sa décision d’exercer son droit
                                    de rétractation. Pour exercer son droit de rétractation,
                                    l’Acheteur informe le Vendeur de sa décision de se rétracter,
                                    avant l’expiration du délai de quatorze (14) jours, au moyen
                                    d'une déclaration exprimant sa volonté non ambiguë de se
                                    rétracter (par exemple, lettre envoyée par la poste ou
                                    courrier électronique ou par l’intermédiaire du service client
                                    Liveshopp) indiquant notamment la commande concernée. Pour que
                                    le délai de rétractation soit respecté, il suffit que
                                    l’Acheteur transmette sa communication relative à l'exercice
                                    du droit de rétractation avant l'expiration du délai de
                                    rétractation. L’Article objet du droit de rétractation devra
                                    ensuite être retourné au Vendeur, à l’adresse indiquée par ce
                                    dernier, sans retard excessif et, en tout état de cause, au
                                    plus tard quatorze (14) jours après que l’Acheteur aura
                                    communiqué sa décision d’exercer son droit de rétractation.
                                    L’Article devra être retourné non-utilisé, dans son emballage
                                    d'origine et accompagné de tous ses accessoires. Votre
                                    responsabilité n'est engagée qu'à l'égard de la dépréciation
                                    du produit résultant de manipulations autres que celles
                                    nécessaires pour établir la nature, les caractéristiques et le
                                    bon fonctionnement de l’Article. Sauf indication contraire de
                                    la part du Vendeur au sein de la Fiche Produit ou si
                                    l’exercice du droit de rétractation par l’Acheteur fait suite
                                    à une erreur du Vendeur, les frais de retour sont supportés
                                    par l’Acheteur. Le Vendeur remboursera à l’Acheteur le prix de
                                    l’Article objet du droit de rétractation, ainsi que les frais
                                    de livraison au prix de la livraison standard effectuée (les
                                    frais supplémentaires que l’Acheteur a payés, s’il a choisi un
                                    mode d’expédition plus coûteux que la livraison standard, ne
                                    seront pas remboursés), sauf si l’exercice du droit de
                                    rétractation par l’Acheteur fait suite à une erreur du
                                    Vendeur, sans retard injustifié et au plus tard dans un délai
                                    de quatorze (14) jours après que l’Acheteur aura communiqué sa
                                    décision d’exercer son droit de rétractation. Si le Vendeur ne
                                    récupère pas lui-même les Articles, le Vendeur peut différer
                                    le remboursement jusqu'à récupération des Articles ou jusqu'à
                                    ce que l’Acheteur ait fourni une preuve de l'expédition de ces
                                    Articles, la date retenue étant celle du premier de ces faits.
                                    Le remboursement sera effectué par le Vendeur en utilisant le
                                    même moyen de paiement que celui utilisé pour l’achat initial,
                                    par l’intermédiaire du Service de Paiement Intégré. En tout
                                    état de cause, ce remboursement n'occasionnera pas de frais
                                    pour l’Acheteur. Conformément à l’article L. 221-28 du Code de
                                    la consommation, l’Acheteur ne bénéficie pas d’un droit de
                                    rétractation pour certains Articles tels que notamment pour
                                    les Articles confectionnés selon les spécifications de
                                    l’Acheteur (ex. personnalisés) ou les Articles descellés par
                                    l’Acheteur (ex. boosters ou paquets de cartes à collectionner
                                    ouverts).{'\n'}
                                    {'\n'}
                                    RECLAMATIONS – MEDIATION – LITIGES {'\n'}
                                    {'\n'}- Réclamations {'\n'}À tout moment, l’Acheteur a la
                                    possibilité de contacter le Vendeur, d’adresser toute
                                    réclamation relative aux Articles commandés par
                                    l’intermédiaire du service de support Liveshopp, notamment
                                    pour faire valoir ses garanties quand elles sont en cours. Le
                                    service de support Liveshopp contactera le Vendeur pour
                                    l’informer de la réclamation. L'Acheteur et le Vendeur feront
                                    leurs meilleurs efforts pour parvenir à la résolution amiable
                                    du litige. Toutefois, si dans un délai de dix (10) jours à
                                    compter de la première réclamation adressée par l’Acheteur, le
                                    litige n’a pas fait l’objet d’une résolution amiable,
                                    l’Acheteur et le Vendeur tenteront de trouver une solution au
                                    problème remonté conformément au processus de Médiation
                                    Liveshopp détaillé à l’article 10 des CGU.{'\n'}
                                    {'\n'}- Médiation{'\n'}
                                    L’Acheteur a la possibilité de saisir les services d’un
                                    médiateur pour régler amiablement le litige de consommation
                                    lié à une Transaction. L’Acheteur devra informer le Vendeur
                                    sans délai de cette demande. Conformément à l’article 14 du
                                    Règlement (UE) n° 524/2013, la Commission Européenne a mis en
                                    place une plateforme de Règlement en Ligne des Litiges,
                                    facilitant le règlement indépendant par voie extrajudiciaire
                                    des litiges en ligne entre consommateurs et professionnels de
                                    l’Union européenne. Cette plateforme est accessible au lien
                                    suivant : https://webgate.ec.europa.eu/odr/{'\n'}
                                    {'\n'}- Litiges {'\n'}
                                    Toute litige relatif à la validité, la conclusion,
                                    l'interprétation, l'exécution ou la cessation des CGV pourra
                                    être soumis aux juridictions compétentes.{'\n'}
                                    {'\n'}- Garantie {'\n'}
                                    L’Acheteur dispose d'une garantie légale de conformité au
                                    titre de laquelle les Vendeurs répondent des défauts de
                                    conformité de l’Article existant au moment de la délivrance de
                                    l’Article, ainsi que des défauts de conformité de l’emballage,
                                    des instructions de montage ou de l’installation si celle-ci
                                    était à la charge du Vendeur ou si l'installation incorrecte
                                    effectuée par l’Acheteur est due à des lacunes ou erreurs dans
                                    les instructions d'installation que le Vendeur a fournies à
                                    l’Acheteur. L’Acheteur dispose également d’une garantie légale
                                    relative aux vices cachés. Ces garanties légales s’exercent
                                    selon les modalités décrites dans l’encadré ci-dessous. Au
                                    sein de cet encadré, le terme « consommateur » désigne
                                    l’Acheteur, tandis que le terme « professionnel » désigne le
                                    Vendeur Professionnel, le terme « bien » correspond au(x)
                                    Article(s) concerné(s). Les Articles n’incluent pas la
                                    fourniture d'un contenu numérique ou d'un service numérique.
                                    La garantie légale de conformité et la garantie légale
                                    relative aux vices cachés s’exerce en contactant le service
                                    support de Liveshopp dont les coordonnées figurent. Pour
                                    solliciter la mise en œuvre de ces garanties légales,
                                    l’Acheteur doit contacter le service support de Liveshopp, en
                                    indiquant la référence de l’Article, la référence de la
                                    facture, et l’objet de la demande. Le consommateur dispose
                                    d'un délai de deux ans à compter de la délivrance du bien pour
                                    obtenir la mise en œuvre de la garantie légale de conformité
                                    en cas d'apparition d'un défaut de conformité. Durant ce
                                    délai, le consommateur n'est tenu d'établir que l'existence du
                                    défaut de conformité et non la date d'apparition de celui-ci.
                                    Lorsque le contrat de vente du bien prévoit la fourniture d'un
                                    contenu numérique ou d'un service numérique de manière
                                    continue pendant une durée supérieure à deux ans, la garantie
                                    légale est applicable à ce contenu numérique ou ce service
                                    numérique tout au long de la période de fourniture prévue.
                                    Durant ce délai, le consommateur n'est tenu d'établir que
                                    l'existence du défaut de conformité affectant le contenu
                                    numérique ou le service numérique et non la date d'apparition
                                    de celui-ci. La garantie légale de conformité emporte
                                    obligation pour le professionnel, le cas échéant, de fournir
                                    toutes les mises à jour nécessaires au maintien de la
                                    conformité du bien. La garantie légale de conformité donne au
                                    consommateur droit à la réparation ou au remplacement du bien
                                    dans un délai de trente jours suivant sa demande, sans frais
                                    et sans inconvénient majeur pour lui. Si le bien est réparé
                                    dans le cadre de la garantie légale de conformité, le
                                    consommateur bénéficie d'une extension de six mois de la
                                    garantie initiale. Si le consommateur demande la réparation du
                                    bien, mais que le vendeur impose le remplacement, la garantie
                                    légale de conformité est renouvelée pour une période de deux
                                    ans à compter de la date de remplacement du bien. Le
                                    consommateur peut obtenir une réduction du prix d'achat en
                                    conservant le bien ou mettre fin au contrat en se faisant
                                    rembourser intégralement contre restitution du bien, si :{' '}
                                    {'\n'}
                                    {'\n'}
                                    1° Le professionnel refuse de réparer ou de remplacer le bien
                                    {'\n'}
                                    2° La réparation ou le remplacement du bien intervient après
                                    un délai de trente jours{'\n'}
                                    3° La réparation ou le remplacement du bien occasionne un
                                    inconvénient majeur pour le consommateur, notamment lorsque le
                                    consommateur supporte définitivement les frais de reprise ou
                                    d'enlèvement du bien non conforme, ou s'il supporte les frais
                                    d'installation du bien réparé ou de remplacement{'\n'}
                                    4° La non-conformité du bien persiste en dépit de la tentative
                                    de mise en conformité du vendeur restée infructueuse{'\n'}
                                    {'\n'}
                                    Le consommateur a également droit à une réduction du prix du
                                    bien ou à la résolution du contrat lorsque le défaut de
                                    conformité est si grave qu'il justifie que la réduction du
                                    prix ou la résolution du contrat soit immédiate. Le
                                    consommateur n'est alors pas tenu de demander la réparation ou
                                    le remplacement du bien au préalable. Le consommateur n'a pas
                                    droit à la résolution de la vente si le défaut de conformité
                                    est mineur.{'\n'}
                                    {'\n'}
                                    Toute période d'immobilisation du bien en vue de sa réparation
                                    ou de son remplacement suspend la garantie qui restait à
                                    courir jusqu'à la délivrance du bien remis en état. Les droits
                                    mentionnés ci-dessus résultent de l'application des articles
                                    L. 217-1 à L. 217-32 du code de la consommation. Le vendeur
                                    qui fait obstacle de mauvaise foi à la mise en œuvre de la
                                    garantie légale de conformité encourt une amende civile d'un
                                    montant maximal de 300 000 euros, qui peut être porté jusqu'à
                                    10 % du chiffre d'affaires moyen annuel (article L. 241-5 du
                                    code de la consommation). Le consommateur bénéficie également
                                    de la garantie légale des vices cachés en application des
                                    articles 1641 à 1649 du code civil, pendant une durée de deux
                                    ans à compter de la découverte du défaut. Cette garantie donne
                                    droit à une réduction de prix si le bien est conservé ou à un
                                    remboursement intégral contre restitution du bien. Pour les
                                    Articles achetés d’occasion ou reconditionnés et au-delà de
                                    six (6) mois à compter de la date de délivrance de l’Article,
                                    l’Acheteur devra prouver l’existence du défaut de conformité
                                    allégué au moment de la délivrance. Dans le cas où la mise en
                                    conformité de l’Article ne peut intervenir sur le lieu où
                                    l’Article se trouve, le Vendeur Professionnel en informera
                                    l’Acheteur via le service de support de Liveshopp. Le Vendeur
                                    Professionnel vous remboursera les frais d’envoi de l’Article
                                    en vue de sa mise en conformité dans un délai de quatorze (14)
                                    jours à compter du jour où le Vendeur Professionnel vous
                                    informera de la prise en charge du bien au titre de la
                                    garantie légale de conformité. La garantie légale de
                                    conformité s’applique indépendamment de la garantie
                                    commerciale pouvant éventuellement couvrir votre bien.{'\n'}
                                    {'\n'}- Évaluation des vendeurs {'\n'}
                                    {'\n'}
                                    Afin de permettre aux Acheteurs de choisir les Vendeurs les
                                    plus fiables et qui respectent les CGU, Liveshopp met à la
                                    disposition des Acheteurs des moyens leur permettant
                                    d’exprimer leur évaluation de la performance des Vendeurs
                                    après confirmation de la réception de l’Article commandé.
                                    L'appréciation est réalisée par l’attribution d’étoiles, de 1
                                    à 5 sur la base de l’expérience de l’Acheteur et par une
                                    évaluation sur la base des critères suivants : état de
                                    l’Article et correspondance avec la description faite par le
                                    Vendeur, respect du délai de livraison annoncé par le Vendeur,
                                    emballage de l’Article. - Loi applicable{'\n'}
                                    {'\n'}
                                    Les CGV sont régies par le droit français. A titre
                                    d’information, veuillez noter que les CGV s’appliqueront à
                                    toute Transaction ayant lieu par l’intermédiaire de la page
                                    française de la Plateforme ou tout Utilisateur résident
                                    français et/ou auquel le droit français serait par ailleurs
                                    applicable, dans la limite la plus étendue permise par la loi.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    Préambule.
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp S.A.S, société par actions simplifiée dont le siège
                                    social est situé 1 place jehan rictus, 93270, Sevran livry,
                                    (ci-après « Liveshopp » ou « Nous ») propose une Plateforme
                                    qui permet notamment à des Acheteurs, après création d’un
                                    compte, d'acheter des Articles proposées par des Vendeurs
                                    Professionnels ou des Vendeurs Particuliers, inscrits sur la
                                    Plateforme, au cours de Ventes en Direct. Les présentes CGU
                                    ont pour objet de définir les modalités et conditions
                                    d’utilisation de la Plateforme ainsi que les droits et
                                    obligations des Utilisateurs dans ce cadre. Pour utiliser la
                                    Plateforme, les Utilisateurs s’engagent à prendre connaissance
                                    des CGU. En créant leur compte, les Utilisateurs acceptent
                                    expressément sans réserve les CGU et la Politique de
                                    Confidentialité.
                                </Text>
                            </View>
                            <View style={styles.rgpdContainer}>
                                <Text
                                    style={{
                                        color: colors.DARK,
                                        fontSize: 30,
                                        textAlign: 'left',
                                        fontWeight: 800,
                                        marginBottom: 20,
                                    }}>
                                    Préambule.
                                </Text>
                                <Text style={styles.headlineMessage}>
                                    Liveshopp S.A.S, société par actions simplifiée dont le siège
                                    social est situé 1 place jehan rictus, 93270, Sevran livry,
                                    (ci-après « Liveshopp » ou « Nous ») propose une Plateforme
                                    qui permet notamment à des Acheteurs, après création d’un
                                    compte, d'acheter des Articles proposées par des Vendeurs
                                    Professionnels ou des Vendeurs Particuliers, inscrits sur la
                                    Plateforme, au cours de Ventes en Direct. Les présentes CGU
                                    ont pour objet de définir les modalités et conditions
                                    d’utilisation de la Plateforme ainsi que les droits et
                                    obligations des Utilisateurs dans ce cadre. Pour utiliser la
                                    Plateforme, les Utilisateurs s’engagent à prendre connaissance
                                    des CGU. En créant leur compte, les Utilisateurs acceptent
                                    expressément sans réserve les CGU et la Politique de
                                    Confidentialité.
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 350,
        textAlign: 'center',
    },
    headlineMessage: {color: colors.DARK, fontSize: 15, textAlign: 'left'},
    rgpdContainer: {width: 350, flexDirection: 'column', marginBottom: 30},
    rgpdContainerTitle: {width: 380, marginBottom: 30, marginTop: 30},
    fieldContainer: {margin: 10, marginBottom: 30},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        width: 350,
        textAlign: 'left',
    },
    action: {},
    resetPassword: {color: 'white'},
});

export default SettingNewLive;
