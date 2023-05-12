import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SellerStacks from '../screens/SellerStacks/SellerStacks';
import SettingProfilScreen from '../screens/SettingProfilScreen/SettingProfilScreen';
import colors from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import {ActionSheetIOS, Alert, Pressable, TouchableOpacity} from 'react-native';
import SettingNewLive from '../screens/SettingNewLive/SettingNewLive';
import LiveScreen from '../screens/LiveScreen/LiveScreen';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import {useDispatch, useSelector} from 'react-redux';
import {setIsGone, setIsJoin, setLiveData} from '../redux/slices/livesSlice';
import {View, Text} from 'react-native';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import SettingShippingAddress from '../screens/SettingShippingAddress/SettingShippingAddress';
import BlockedUsers from '../screens/BlockedUsers/BlockedUsers';
import rgpdScreen from '../screens/Rgpd/Rgpd';
import socket from '../services/config/clientSocketIoConfig';
import Toast from 'react-native-toast-message';
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {useNavigation} from "@react-navigation/native";
import customer from "../services/customer";

const Stack = createNativeStackNavigator();

const SellerStack = () => {
    const user = useSelector(state => state.user.user);
    const liveData = useSelector(state => state.lives.liveData);
    const {isHost} = useSelector(state => state.lives);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const leaveRoom = () => {
        socket.emit('leaveRoom', {liveData, user});
        dispatch(setIsJoin(false));
        dispatch(setIsGone(true));
        Toast.hide();
        dispatch(
            setLiveData({
                channelName: '',
                sellerId: '',
                auctionId: '',
                auctionsStatus: '',
                userCount: '',
                messages: [],
                currentAuction: {
                    userId: '',
                    username: '',
                    productName: false,
                    currentProductAmount: '',
                    currentAuctionDelay: '',
                    currentAuctionStatus: '',
                    salePrice: '',
                },
            }),
        );
        isHost ? navigation.navigate('OnGoingLives') : navigation.navigate('LivesScreen');
    }

    const showObjectionableAction = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Annuler', 'Bloquer cet utilisateur', 'Signaler cet utilisateur'],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return;
                } else if (buttonIndex === 1) {
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Annuler', 'Bloquer cet utilisateur'],
                            destructiveButtonIndex: 1,
                            cancelButtonIndex: 0,
                            userInterfaceStyle: 'light',
                            title: 'Vous ne verrez plus les messages et les lives de cet de utilisateur'
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                // block user
                                socket.emit('blockCustomer', {user, userId: liveData.sellerId, profil: 'seller'});
                                leaveRoom();
                            }
                        },
                    );
                } else if (buttonIndex === 2) {
                    // signal user
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Annuler', 'Signaler cet utilisateur'],
                            destructiveButtonIndex: 1,
                            cancelButtonIndex: 0,
                            userInterfaceStyle: 'light',
                            title: 'Tout comportement ne respectant pas les conditions générales sera sanctionné'
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                customer
                                    .signalCustomer({liveData, flag_type: 'live'})
                                    .then(res => res)
                                    .then(data => {
                                        Alert.alert('', data.message, [
                                            {text: 'OK'},
                                        ]);
                                    })
                                    .catch(err => {
                                        Alert.alert('', err.message, [
                                            {text: 'OK'},
                                        ]);
                                    });
                            }
                        },
                    );
                }
            },
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureDirection: 'vertical',
            }}>
            <Stack.Screen name="SellerStacks" component={SellerStacks}/>
            <Stack.Screen
                name="SettingProfilScreen"
                component={SettingProfilScreen}
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
                    title: 'Modifier mon profil',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
            <Stack.Screen
                name="SettingShippingAddress"
                component={SettingShippingAddress}
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
                    title: 'Adresse de livraison',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
            <Stack.Screen
                name="BlockedUsers"
                component={BlockedUsers}
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
                    title: 'Utilisateur bloqués',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
            <Stack.Screen
                name="SettingNewLive"
                component={SettingNewLive}
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
                    title: 'Crée un nouveau live',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
            <Stack.Screen
                name="LiveScreen"
                component={LiveScreen}
                options={() => ({
                    gestureEnabled: false,
                    headerShown: true,
                    headerShadowVisible: false, // applied here
                    headerTransparent: true,
                    navigationOptions: {
                        gesturesEnabled: false,
                    },
                    headerLeft: () => (
                        <View style={{alignItems: 'center'}}>
                            <FontAwesomeIcon icon={faUsers} color={colors.LIGHT} size={18}/>
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginTop: 5,
                                    color: colors.LIGHT,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {liveData && liveData.userCount}
                            </Text>
                        </View>
                    ),
                    headerRight: () => (
                        <Pressable onPress={() => leaveRoom()}>
                            <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30}/>
                        </Pressable>
                    ),
                    headerTitle: () => <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 20,
                            color: colors.LIGHT,
                            fontFamily: 'Roboto-Regular',
                            marginRight: 5
                        }}>{liveData.sellerName}</Text>
                        {!isHost && <TouchableOpacity onPress={() => showObjectionableAction(liveData.sellerId)}>
                            <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                color={colors.LIGHT}
                                size={17}
                            />
                        </TouchableOpacity>}
                    </View>,
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerTitleStyle: {
                        color: colors.LIGHT,
                    },
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
                    title: 'Conditions générales',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
        </Stack.Navigator>
    );
};

export default SellerStack;
