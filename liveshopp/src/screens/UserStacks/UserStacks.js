import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faUser, faBoxOpen} from '@fortawesome/free-solid-svg-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from '../SettingsScreen/SettingsScreen';
import LivesScreen from '../LivesScreen/LivesScreen';
import OrderTab from '../OrderTab/OrderTab';

const Tab = createBottomTabNavigator();

export const UserStacks = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: 'black'},
        headerStyle: {backgroundColor: 'black'},
        headerTitleStyle: {color: 'white', fontFamily: 'FugazOne-Regular'},
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        options={{
          title: 'LIVES',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faHome} size={20} color={'white'} />
          ),
        }}
        name="LivesScreen"
        component={LivesScreen}
      />
      <Tab.Screen
        options={{
          title: 'MES COMMANDES',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faBoxOpen} size={20} color={'white'} />
          ),
        }}
        name="Order"
        component={OrderTab}
      />
      <Tab.Screen
        options={{
          title: 'MON PROFIL',
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faUser} size={20} color={'white'} />
          ),
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profilHeadline: {marginBottom: 30},
  container: {
    flex: 1,
  },
});

export default UserStacks;
