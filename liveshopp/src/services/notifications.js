import notifee, { AuthorizationStatus } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import customer from './customer';

const onNotification = async (notif) => {
  try {
    console.log('in onNotification 2');
    console.log(notif);

    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    console.log('channelid', channelId);

    notifee
      .displayNotification({
        title: 'Your order has been shipped',
        body: `Your order was shipped today super quickly!`,
        android: {
          channelId: 'default',
        },
      })
      .then(
        (s) => {
          console.log('success', s);
        },
        (e) => {
          console.log('rejected', e);
        },
      )
      .catch((error) => {
        console.log('got a probleme', error);
      });

    console.log('finished');
    // const { type } = notif.data;

    // if (type === 'seller_joined') {
    //   // DO SOMETHING SPECIFIC
    // }

    // notifee.displayNotification(JSON.parse(notif.data.notifee));
    // notifee.displayNotification(notif);
  } catch (error) {
    console.log(error);
  }
};

const fetchAndStoreNotificationToken = async () => {
  // Register the device with FCM
  // await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  console.log(token);

  // Save the token in DB
  customer.updateCustomerNotificationToken(token);
};

const requestUserPermission = async () => {
  await notifee.requestPermission({
    provisional: true,
  });
};

const initNotifications = () => {
  fetchAndStoreNotificationToken();
  requestUserPermission();

  // Reset badge count when opening the app
  notifee.setBadgeCount(0);

  messaging().onMessage(onNotification);
  messaging().setBackgroundMessageHandler(onNotification);
};

module.exports = { initNotifications };
