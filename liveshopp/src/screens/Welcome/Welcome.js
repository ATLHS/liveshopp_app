import React, { useEffect } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { setIsAuthenticate, setUser } from '../../redux/slices/userSlice';
import axiosConfig from '../../services/config/axiosConfig';
import colors from '../../styles/colors';

export const Welcome = ({ navigation, route }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { data } = route.params;
    const timeout = setTimeout(async () => {
      await AsyncStorage.setItem('@token', data.token);
      axiosConfig.defaults.headers.Authorization = `Bearer ${data.token}`;
      dispatch(setUser(data.user));
      dispatch(setIsAuthenticate(true));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [dispatch, route.params]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.welcomeContainer}>
            <View style={styles.headlineContainer}>
              <Text style={styles.headline}>WELCOME !</Text>
            </View>
            <View style={{ height: 100 }}>
              <Image
                style={{ height: 100, width: 100 }}
                source={{
                  uri: 'https://em-content.zobj.net/source/microsoft-teams/337/clapping-hands_1f44f.png',
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headlineContainer: { marginBottom: 30 },
  welcomeContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 150,
  },
  fieldContainer: { margin: 10 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'FugazOne-Regular',
    fontSize: 30,
    width: 280,
    textAlign: 'center',
  },
});

export default Welcome;
