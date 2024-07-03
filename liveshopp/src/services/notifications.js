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
    const data = JSON.parse(notif.data.notifee);

    if (data.type && data.type === Notification.LIVE_STARTED) {
      data.body = `${data.live.sellerName} ${i18n.t('notifSellerIsLive')}`;
    }

    resetDisplayedNotifications();

    await notifee.displayNotification(data);
  } catch (error) {
    console.log(error);
  }
};

const onBackgroundEvent = async ({ type, detail }) => {
  console.log('Background event detected', type, detail);
};

// This is a trick when the app is killed, the notification text is in english
// Once through `onNotification()` it might create a new notification in another language
// which sets two notifications in the notif center
// By discarding old notifs, we keep only the latest one
//
const resetDisplayedNotifications = async () => {
  const oldNotifs = await notifee.getDisplayedNotifications();
  console.log('deleteting old notifs', oldNotifs.length);
  oldNotifs.map((notification) => notifee.cancelDisplayedNotification(notification.id));
};

// Create a channel (required for Android)
const createAndroidChannels = async () => {
  await notifee.createChannel({
    id: 'important',
    name: 'Live stream',
    lights: true,
    vibration: true,
    sound: 'default',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
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
  try {
    if (requestUserPermission()) {
      // Refresh notification token
      fetchAndStoreNotificationToken();

      // Reset badge count when opening the app
      notifee.setBadgeCount(0);

      // Create Android notifications channels
      createAndroidChannels();

      // Set notification handlers for foreground, background and killed app states
      notifee.onBackgroundEvent(onBackgroundEvent);
      messaging().setBackgroundMessageHandler(onNotification);
      return messaging().onMessage(onNotification);
    }
    return () => {};
  } catch (error) {
    console.error(error);
  }
};

module.exports = { initNotifications };
