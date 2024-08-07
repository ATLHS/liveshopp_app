import { getUniqueId } from 'react-native-device-info';

import i18n from 'i18next';

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import Notification from '../constants/Notification';
import customer from './customer';

const onNotification = async (notif) => {
  try {
    const data = JSON.parse(notif.data.notifee);

    if (data.type && data.type === Notification.LIVE_STARTED) {
      data.body = `${data.live.sellerName} ${i18n.t('notifSellerIsLive')}`;

      AsyncStorage.setItem(
        'notification:lastLive',
        JSON.stringify({ id: data.live.id, sellerId: data.live.sellerId }),
      );
    }

    resetDisplayedNotifications();

    await notifee.displayNotification(data);
  } catch (error) {
    console.log(error);
  }
};

// This is a trick when the app is killed, the notification text is in english
// Once through `onNotification()` it might create a new notification in another language
// which sets two notifications in the notif center
// By discarding old notifs, we keep only the latest one
//
const resetDisplayedNotifications = async () => {
  const oldNotifs = await notifee.getDisplayedNotifications();
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

// Link a notification token to a device ID
// Since it is called at boot time, we don't know yet if the user is logged in.
// So we update the DB for an anonymous user first, then we call updateUserDevice().
const fetchAndStoreNotificationToken = async () => {
  // Get the device notification token
  const token = await messaging().getToken();
  const deviceId = await getUniqueId();

  // Save the token in DB
  customer.updateDeviceNotificationToken(deviceId, token);
};

// Link a device ID to a user
const updateUserDevice = async () => {
  const deviceId = await getUniqueId();
  customer.updateCustomerDevice(deviceId);
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
      messaging().setBackgroundMessageHandler(onNotification);
      return messaging().onMessage(onNotification);
    }
    return () => {};
  } catch (error) {
    console.error(error);
  }
};

module.exports = { initNotifications, updateUserDevice };
