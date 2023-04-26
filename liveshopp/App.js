import RootStack from './src/navigation/RootStack';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {useEffect, useState} from 'react';
import authService from './src/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setUser,
  setIsAuthenticate,
  selectIsAuthenticate,
} from './src/redux/slices/userSlice';
import axiosConfig from './src/services/config/axiosConfig';
import ToastComponent from './src/components/ToastComponent/ToastComponent';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem('@token').then(token => {
      if (token) {
        axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
        authService
            .isAuthenticate()
            .then(res => res)
            .then(data => {
              store.dispatch(setUser(data.user));
              store.dispatch(setIsAuthenticate(data.isAuthenticate));
              setIsLoading(false);
            })
            .catch(err => {
              store.dispatch(setUser({profil: null}));
              store.dispatch(setIsAuthenticate(false));
              setIsLoading(false);
            });
      } else {
        store.dispatch(setUser({profil: null}));
        store.dispatch(setIsAuthenticate(false));
        setIsLoading(false);
      }
    });
  });

  return (
      <Provider store={store}>
        <RootStack isLoading={isLoading} />
        <ToastComponent />
      </Provider>
  );
};

export default App;
