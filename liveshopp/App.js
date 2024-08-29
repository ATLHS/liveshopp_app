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
    AsyncStorage.getItem('@token').then((token) => {
      if (token) {
        axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
        authService
          .isAuthenticate()
          .then((res) => res)
          .then((data) => {
            store.dispatch(setUser(data.user));
            store.dispatch(setIsAuthenticate(data.isAuthenticate));
            setIsLoading(false);

            // FIXME
            // Ideally, this would be done only once in SignIn.js
            //
            updateUserDevice();

            Sentry.setUser({
              id: data.user.id,
              email: data.user.email,
              profil: data.user.profil,
              username: `${data.user.firstname} ${data.user.lastname}`,
              ip_address: '{{auto}}',
            });
          })
          .catch((err) => {
            store.dispatch(setUser({ profil: null }));
            store.dispatch(setIsAuthenticate(false));
            setIsLoading(false);
          });
      } else {
        store.dispatch(setUser({ profil: null }));
        store.dispatch(setIsAuthenticate(false));
        setIsLoading(false);
      }
    });
  });

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
