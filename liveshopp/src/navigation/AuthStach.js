import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding/Onboarding';
import SignIn from '../screens/SignIn/SignIn';
import UserSignUp from '../screens/UserSignUp/UserSignUp';
import SellerSignUp from '../screens/SellerSignUp/SellerSignUp';
import EmailVerificationCode from '../screens/EmailVerificationCode/EmailVerificationCode';
import Welcome from '../screens/Welcome/Welcome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import {Pressable} from 'react-native';
import colors from '../styles/colors';
import rgpdScreen from "../screens/Rgpd/Rgpd";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import React from "react";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={({navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.DARK,
          },
        })}
      />
      <Stack.Screen
        name="UserSignup"
        component={UserSignUp}
        options={({navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.DARK,
          },
        })}
      />
      <Stack.Screen
        name="SellerSignup"
        component={SellerSignUp}
        options={({navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.DARK,
          },
        })}
      />
      <Stack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationCode}
        options={({navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.DARK,
          },
        })}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
        <Stack.Screen
            name="rgpdScreen"
            component={rgpdScreen}
            options={({navigation}) => ({
                headerShown: true,
                headerShadowVisible: false, // applied here
                headerLeft: () => (
                    <Pressable onPress={() => navigation.pop()}>
                        <FontAwesomeIcon
                            icon={faAngleLeft}
                            color={colors.DARK}
                            size={30}
                        />
                    </Pressable>
                ),
                title: '',
                headerStyle: {
                    backgroundColor: colors.LIGHT,
                },
            })}
        />
    </Stack.Navigator>
  );
};

export default AuthStack;
