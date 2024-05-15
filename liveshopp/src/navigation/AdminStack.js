import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colors from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import {
    ActionSheetIOS,
    Alert,
    Pressable,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import LiveScreen from '../screens/LiveScreen/LiveScreen';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import {useDispatch, useSelector} from 'react-redux';
import {setIsGone, setIsJoin, setLiveData} from '../redux/slices/livesSlice';
import {View, Text} from 'react-native';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import rgpdScreen from '../screens/Rgpd/Rgpd';
import socket from '../services/config/clientSocketIoConfig';
import Toast from 'react-native-toast-message';
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import AdminStacks from '../screens/AdminStacks/AdminStacks';
import SettingProfilScreen from '../screens/SettingProfilScreen/SettingProfilScreen';
import AdminBlockedUsers from '../screens/AdminBlockedUsers/AdminBlockedUsers';
import AdminSignaledUsers from '../screens/AdminSignaledUsers/AdminSignaledUsers';
import admin from '../services/admin';

const Stack = createNativeStackNavigator();

const SellerStack = () => {
    const user = useSelector(state => state.user.user);
    const liveData = useSelector(state => state.lives.liveData);
    const {isHost} = useSelector(state => state.lives);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    const showObjectionableAdminAction = data => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Annuler', 'Bannir cet utilisateur'],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return;
                } else if (buttonIndex === 1) {
                    admin
                        .banUser(data)
                        .then(res => res)
                        .then(data => {
                            Alert.alert('', data.message, [{text: 'OK'}]);
                        })
                        .catch(err => {
                            Alert.alert('', err.message, [{text: 'OK'}]);
                        });
                }
            },
        );
    };

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
        navigation.navigate('LivesScreen');
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureDirection: 'vertical',
            }}>
            <Stack.Screen name="AdminStacks" component={AdminStacks} />
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
                name="AdminBlockedUsers"
                component={AdminBlockedUsers}
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
                    title: 'Utilisateurs bloqués sur Liveshopp',
                    headerStyle: {
                        backgroundColor: colors.LIGHT,
                    },
                })}
            />
            <Stack.Screen
                name="AdminSignaledUsers"
                component={AdminSignaledUsers}
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
                    title: 'Utilisateurs signalé sur Liveshopp',
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
                            <FontAwesomeIcon
                                icon={faUsers}
                                color={colors.LIGHT}
                                size={18}
                            />
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
                            <FontAwesomeIcon
                                icon={faXmark}
                                color={colors.LIGHT}
                                size={30}
                            />
                        </Pressable>
                    ),
                    headerTitle: () => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: colors.LIGHT,
                                    fontFamily: 'Roboto-Regular',
                                    marginRight: 5,
                                }}>
                                {liveData.sellerName}
                            </Text>
                            {!isHost && (
                                <TouchableOpacity
                                    onPress={() =>
                                        showObjectionableAdminAction(liveData)
                                    }>
                                    <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                        color={colors.LIGHT}
                                        size={17}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ),
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
