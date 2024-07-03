import i18n from 'i18next';

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import Notification from '../constants/Notification';
import customer from './customer';

const onNotification = async (notif) => {
  try {
    console.log(notif);

    // Create a channel (required for Android)
    await notifee.createChannel({
      id: 'important',
      name: 'Live stream',
      lights: true,
      vibration: true,
      sound: 'default',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });

    const data = JSON.parse(notif.data.notifee);

    if (data.type && data.type === Notification.LIVE_STARTED) {
      data.body = `${data.live.sellerName} ${i18n.t('notifSellerIsLive')}`;
    }

    await notifee.displayNotification(data);
  } catch (error) {
    console.log(error);
  }
};

const fetchAndStoreNotificationToken = async () => {
  // Get the device notification token
  const token = await messaging().getToken();

  // Save the token in DB
  customer.updateCustomerNotificationToken(token);
};

const requestUserPermission = async () => {
  const settings = await notifee.requestPermission({
    alert: true,
    badge: true,
    provisional: false,
    sound: true,
  });

  if (settings.authorizationStatus === AuthorizationStatus.DENIED) return false;

  return true;
};

const initNotifications = () => {
  if (requestUserPermission()) {
    fetchAndStoreNotificationToken();

    // Reset badge count when opening the app
    notifee.setBadgeCount(0);

    // Set notification handlers for foreground and background app states
    messaging().setBackgroundMessageHandler(onNotification);
    return messaging().onMessage(onNotification);
  }
};

module.exports = { initNotifications };
