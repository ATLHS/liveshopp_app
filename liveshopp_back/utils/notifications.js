const Sentry = require('@sentry/node');
const { firebase } = require('./services');
const User = require('../models/user');
const { log } = require('../middleware/logger');

const sendLiveIsStarting = async (live) => {
  try {
    const users = await User.find({ notificationToken: { $ne: null } })
      .select({ notificationToken: 1, _id: 0 })
      .exec();

    const tokens = users.map((user) => user.notificationToken);

    const android = {
      channelId: 'important',
      smallIcon: 'ic_notification',
      largeIcon: live.imageUrl,
      category: 'call',
      importance: 4,
      style: { type: 0, picture: live.imageUrl },
    };

    const ios = {
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
      attachments: [
        {
          url: live.imageUrl,
        },
      ],
    };

    const message = `${live.sellerName} is now live`;

    const result = await firebase.sendEachForMulticast({
      tokens,
      data: {
        notifee: JSON.stringify({
          body: message,
          title: 'Liveshopp',
          type: 'LIVE_STARTED',
          live: {
            name: live.live_name,
            description: live.live_description,
            sellerName: live.sellerName,
            imageUrl: live.imageUrl,
          },
          android,
          ios,
        }),
      },
      notification: {
        body: message,
        imageUrl: live.imageUrl,
      },
      android: {
        priority: 'high',
        notification: {
          icon: 'ic_notification',
          imageUrl: live.imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            category: 'call',
            // Required for background/quit data-only messages on iOS
            // Note: iOS frequently will receive the message but decline to deliver it to your app.
            // This is an Apple design choice to favor user battery life over data-only delivery
            // reliability. It is not under app control, though you may see the behavior in device logs.
            contentAvailable: true,
            mutableContent: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
            sound: 'default',
          },
        },
      },
    });

    log.debug(result);
  } catch (error) {
    log.error(error);
    Sentry.captureException(error);
  }
};

module.exports = { sendLiveIsStarting };
