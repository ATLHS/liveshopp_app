const Sentry = require('@sentry/node');

const send = async ({ message, data, title }) => {
  try {
    await fetch(process.env.DISCORD_NOTIFICATIONS_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: title || 'Backend Bot',
        content: message,
        embeds: data,
      }),
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

const newUser = (user) => {
  try {
    const title = 'New user signup';
    const message = `:person_raising_hand: **${user.firstname} ${user.lastname}** has registered!`;
    const data = [
      {
        fields: [
          { name: 'ID', value: `\`${user._id}\``, inline: true },
          { name: 'Email', value: user.email, inline: true },
          { name: 'Phone', value: user.phone, inline: true },
        ],
      },
    ];

    send({ message, data, title });
  } catch (error) {
    Sentry.captureException(error);
  }
};

const newSeller = (seller) => {
  try {
    const title = 'New seller signup';
    const message = `:woman_technologist: **${seller.firstname} ${seller.lastname}** has registered!`;
    const data = [
      {
        fields: [
          { name: 'ID', value: `\`${seller._id}\``, inline: true },
          { name: 'Email', value: seller.email, inline: true },
          { name: 'Phone', value: seller.phone, inline: true },
          { name: 'Company', value: seller.company_name, inline: true },
          { name: 'Activity', value: seller.business_activity, inline: true },
          { name: 'Role', value: seller.role, inline: true },
        ],
      },
    ];

    send({ message, data, title });
  } catch (error) {
    Sentry.captureException(error);
  }
};

module.exports = { newSeller, newUser };
