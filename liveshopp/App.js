import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { SENTRY_DSN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

import ToastComponent from './src/components/ToastComponent/ToastComponent';
import RootStack from './src/navigation/RootStack';
import { setIsAuthenticate, setUser } from './src/redux/slices/userSlice';
import { store } from './src/redux/store';
import authService from './src/services/auth';
import axiosConfig from './src/services/config/axiosConfig';
import { updateUserDevice } from './src/services/notifications';

Sentry.init({
  dsn: SENTRY_DSN,
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (!token) return;

        axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
        const data = await authService.isAuthenticate();
        if (!active) return;

        store.dispatch(setUser(data.user));
        store.dispatch(setIsAuthenticate(data.isAuthenticate));
        updateUserDevice().catch((error) => Sentry.captureException(error));

        Sentry.setUser({
          id: data.user.id,
          email: data.user.email,
          profil: data.user.profil,
          username: `${data.user.firstname} ${data.user.lastname}`,
          ip_address: '{{auto}}',
        });
      } catch (error) {
        if (!active) return;
        delete axiosConfig.defaults.headers.Authorization;
        store.dispatch(setUser({ profil: null }));
        store.dispatch(setIsAuthenticate(false));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  return (
    // <React.StrictMode>
    <Provider store={store}>
      <RootStack isLoading={isLoading} />
      <ToastComponent />
    </Provider>
    // </React.StrictMode>
  );
};

export default App;
