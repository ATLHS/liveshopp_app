/**
 * @format
 */
import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';
import { initNotifications } from './src/services/notifications';

initNotifications();

// Check if app was launched in the background and conditionally render null if so
// This is usefull to avoid loading the entire React <App /> for notifications
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    console.log('App has been launched in background, skipping React render');
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
