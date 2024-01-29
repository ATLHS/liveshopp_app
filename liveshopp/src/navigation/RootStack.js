import {NavigationContainer} from '@react-navigation/native';
import UserStack from './UserStack';
import SellerStack from './SellerStack';
import AdminStack from './AdminStack';
import AuthStack from './AuthStach';
import Loading from '../screens/Loading/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {Platform, Alert, Linking} from 'react-native';
import {useEffect} from 'react';
import socket from '../services/config/clientSocketIoConfig';
import {setIsGone, setIsJoin, setLiveData} from '../redux/slices/livesSlice';
import axiosConfig from '../services/config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_STORE_BUNDLE_ID, PLAY_STORE_BUNDLE_ID} from '@env';
import {
    setBlockedUser,
    setIsAuthenticate,
    setUser,
} from '../redux/slices/userSlice';
import Toast from 'react-native-toast-message';
import {checkVersion} from 'react-native-check-version';
import {appVersion} from 'react-native-version-app';

const RootStack = ({isLoading}) => {
    const {user} = useSelector(state => state.user);
    const isAuthenticate = useSelector(state => state.user.isAuthenticate);
    const dispatch = useDispatch();

    useEffect(() => {
        const currentVersion = appVersion();
        const fetchData = async () => {
            const version = await checkVersion({
                platform: Platform.OS,
                country: 'fr',
                bundleId:
                    Platform.OS === 'ios'
                        ? APP_STORE_BUNDLE_ID
                        : PLAY_STORE_BUNDLE_ID,
                currentVersion,
            });

            if (version.needsUpdate) {
                Alert.alert(
                    'Mise à jour requise',
                    "Une nouvelle version de l'application est disponible. Veuillez mettre à jour pour continuer à utiliser l'application.",
                    [
                        {
                            text: 'Mettre à jour',
                            onPress: () => {
                                Linking.openURL(version.url);
                            },
                        },
                    ],
                    {cancelable: false},
                );
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log(socket.id, 'web socket connected');
        });
        if (isAuthenticate) {
            AsyncStorage.getItem('@token').then(token => {
                axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
            });
        }
        socket.removeAllListeners();
    }, [isAuthenticate]);

    socket.on('banUser', async data => {
        if (data.updatedCustomer._id === user.id) {
            socket.emit('leaveRoom', {
                liveData: data.liveData.liveData,
                user: data.updatedCustomer,
            });
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
            await AsyncStorage.removeItem('@token');
            dispatch(setIsAuthenticate(false));
            dispatch(setUser({profil: null}));
        }
    });
    socket.on('hasBeenBlocked', blockedInfo => {
        dispatch(setBlockedUser(blockedInfo));
    });
    socket.on('channelData', channelData => {
        dispatch(setLiveData(channelData));
    });
    socket.on('currentAuctionData', async channelData => {
        try {
            dispatch(setLiveData(channelData));
        } catch (e) {
            console.log(e);
        }
    });

    return (
        <NavigationContainer>
            {isLoading ? (
                <Loading />
            ) : !isAuthenticate ? (
                <AuthStack />
            ) : user.profil === 'admin' ? (
                <AdminStack />
            ) : user.profil === 'seller' ? (
                <SellerStack />
            ) : (
                <UserStack />
            )}
        </NavigationContainer>
    );
};

export default RootStack;
