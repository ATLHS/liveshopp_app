import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { faBoxOpen, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AutocompleteDropdownSearch from '../../components/AutocompleteDropdownSearch/AutocompleteDropdownSearch';
import colors from '../../styles/colors';
import LivesTab from '../LivesTab/LivesTab';
import OrderTab from '../OrderTab/OrderTab';
import SettingsScreen from '../SettingsScreen/SettingsScreen';

const Tab = createBottomTabNavigator();

const UserStacks = ({ navigation }) => {
  return (
    <AutocompleteDropdownContextProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          options={{
            title: 'LIVES',
            tabBarIcon: ({ size }) => (
              <FontAwesomeIcon
                icon={faHome}
                size={styles.tabBarIconSize.fontSize}
                color={styles.tabBarIconColor.color}
              />
            ),
            header: () => (
              <View style={styles.headerContainer}>
                <AutocompleteDropdownSearch navigation={navigation} />
              </View>
            ),
          }}
          name="Lives"
          component={LivesTab}
        />
        <Tab.Screen
          options={{
            title: 'MES COMMANDES',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon
                icon={faBoxOpen}
                size={styles.tabBarIconSize.fontSize}
                color={styles.tabBarIconColor.color}
              />
            ),
          }}
          name="Order"
          component={OrderTab}
        />
        <Tab.Screen
          options={{
            title: 'MON PROFIL',
            tabBarIcon: ({ size }) => (
              <FontAwesomeIcon
                icon={faUser}
                size={styles.tabBarIconSize.fontSize}
                color={styles.tabBarIconColor.color}
              />
            ),
          }}
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </AutocompleteDropdownContextProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  header: {
    backgroundColor: 'white',
  },
  headerTitle: {
    color: 'black',
    fontFamily: 'FugazOne-Regular',
  },
  headerContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 100,
  },
  tabBarIconColor: {
    color: colors.DARK,
  },
  tabBarIconSize: {
    fontSize: 20,
  },
});

export default UserStacks;
