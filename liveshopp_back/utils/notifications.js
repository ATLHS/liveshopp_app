const Sentry = require('@sentry/node');
const { firebase } = require('./services');
const User = require('../models/user');

const sendLiveIsStarting = async () => {
  try {
    const users = await User.find({ notificationToken: { $ne: null } })
      .select({ notificationToken: 1, _id: 0 })
      .exec();

    const tokens = users.map((user) => user.notificationToken);

    console.log(tokens);

    firebase
      .sendEach([
        {
          token: tokens[0],
          data: {
            notifee: JSON.stringify({
              body: 'im lost',
              android: {
                channelId: 'default',
                actions: [
                  {
                    title: 'Mark as Read',
                    pressAction: {
                      id: 'read',
                    },
                  },
                ],
              },
            }),
          },
          // notification: {
          //   body: 'plop body',
          //   title: 'plop title',
          // },
          apns: {
            payload: {
              aps: {
                // Required for background/quit data-only messages on iOS
                // Note: iOS frequently will receive the message but decline to deliver it to your app.
                //           This is an Apple design choice to favor user battery life over data-only delivery
                //           reliability. It is not under app control, though you may see the behavior in device logs.
                'content-available': true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
              },
            },
          },
        },
      ])
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  } catch (error) {
    Sentry.captureException(error);
  }
};

module.exports = { sendLiveIsStarting };
