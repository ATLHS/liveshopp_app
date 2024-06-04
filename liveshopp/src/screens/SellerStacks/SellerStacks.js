import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';

import {
  faBoxOpen,
  faHome,
  faPlus,
  faTowerBroadcast,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AutocompleteDropdownSearch from '../../components/AutocompleteDropdownSearch/AutocompleteDropdownSearch';
import { setLives, setSellerLives } from '../../redux/slices/livesSlice';
import live from '../../services/live';
import seller from '../../services/seller';
import colors from '../../styles/colors';
import LivesTab from '../LivesTab/LivesTab';
import OrderTab from '../OrderTab/OrderTab';
import SellerLiveTab from '../SellerScreens/SellerLiveTab';
import SettingsScreen from '../SettingsScreen/SettingsScreen';

const Tab = createBottomTabNavigator();

export const SellerStacks = ({ navigation }) => {
  const panelRef = useRef(null);

  const createNewLive = () => {
    navigation.navigate('SettingNewLive');
  };
  const createNewAuctionVideo = () => {
    navigation.navigate('auctionVideoSettings');
  };

  return (
    <AutocompleteDropdownContextProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: 'white' },
          headerStyle: { backgroundColor: 'white' },
          headerTitleStyle: {
            color: 'black',
            fontFamily: 'FugazOne-Regular',
          },
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          options={{
            title: 'LIVES',
            tabBarIcon: ({ color, size }) => (
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
            title: 'MES LIVES',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon
                icon={faTowerBroadcast}
                size={styles.tabBarIconSize.fontSize}
                color={styles.tabBarIconColor.color}
              />
            ),
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => panelRef.current?.togglePanel()}
                  style={{ marginRight: 15 }}>
                  <FontAwesomeIcon icon={faPlus} size={25} color={'black'} />
                </TouchableOpacity>
              );
            },
          }}
          name="SellerLives"
          component={SellerLiveTab}
          // listeners={{
          //   tabPress: (e) => {
          //     seller
          //       .getSellerLives()
          //       .then((res) => res)
          //       .then((data) => {
          //         dispatch(setSellerLives(data.sellerLives));
          //       })
          //       .catch((err) => {
          //         console.error(err, 'get lives error.');
          //       });
          //   },
          // }}
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
            tabBarIcon: ({ color, size }) => (
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
      <BottomSheet
        lineStyle={{ marginTop: 30 }}
        lineContainerStyle={{ margin: 0, height: 20 }}
        innerContentStyle={{ padding: 0 }}
        wrapperStyle={{
          height: 200,
        }}
        sliderMinHeight={0}
        ref={(ref) => (panelRef.current = ref)}
        isOpen={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '70%',
            }}>
            <TouchableOpacity
              style={styles.touchableStyle}
              onPress={() => {
                panelRef.current?.togglePanel();
                createNewLive();
              }}>
              <Text style={styles.title}>Créer un live</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableStyle}
              onPress={() => {
                panelRef.current?.togglePanel();
                createNewAuctionVideo();
              }}>
              <Text style={styles.title}>Créer une vidéo enchère</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </AutocompleteDropdownContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarIconColor: {
    color: colors.DARK,
  },
  tabBarIconSize: {
    fontSize: 20,
  },
  touchableStyle: {
    width: 370,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.DARK,
    borderRadius: 8,
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 100,
  },
  title: {
    color: colors.LIGHT,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SellerStacks;
