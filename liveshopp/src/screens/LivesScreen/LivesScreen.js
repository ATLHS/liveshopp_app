import React, {useState} from 'react';
import {REACT_APP_AGORA_APP_ID} from '@env';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
    setIsJoin,
    setRemoteUid,
    setIsGone,
    setLives,
} from '../../redux/slices/livesSlice';
import live from '../../services/live';
import {
    ChannelProfileType,
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
} from 'react-native-agora';
import socket from '../../services/config/clientSocketIoConfig';
import LiveCard from '../../components/liveCard/liveCard';
import {useFocusEffect} from '@react-navigation/native';
import NoData from '../../components/NoData/NoData';

export const LivesScreen = ({navigation}) => {
    const agoraEngineRef = IRtcEngine;
    const {isJoin, isGone} = useSelector(state => state.lives);
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [onGoingLives, setOnGoingLives] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
            setupVideoSDKEngine()
                .then(r => setIsLoading(false))
                .catch(err => err);
        }, []),
    );

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
            live.getLives()
                .then(res => res)
                .then(data => {
                    dispatch(setLives(data.lives));
                    setOnGoingLives(
                        data.lives.filter(
                            live =>
                                live.seller_id !== user.id &&
                                live.live_status === 'live' &&
                                !user.blockedUser
                                    .concat(user.blockedSeller)
                                    .includes(live.seller_id),
                        ),
                    );
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log(err, 'get lives error.');
                    setIsLoading(false);
                });
        }, []),
    );

    useFocusEffect(
        React.useCallback(() => {
            if (isGone) {
                goOut();
            }
        }, [isGone]),
    );

    const getOsPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ]);
        }
    };

    const setupVideoSDKEngine = async () => {
        try {
            // use the helper function to get permissions
            if (Platform.OS === 'android') {
                await getOsPermission();
            }
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;

            agoraEngine.initialize({
                appId: REACT_APP_AGORA_APP_ID,
                channelProfile:
                    ChannelProfileType.ChannelProfileLiveBroadcasting,
            });

            agoraEngine.registerEventHandler({
                onJoinChannelSuccess: _connection => {
                    console.log(
                        `User has successfully joined the channel : ${_connection.channelId}`,
                    );
                },
                onUserJoined: (_connection, Uid) => {
                    dispatch(setRemoteUid(Uid));
                },
                onUserOffline: (_connection, Uid) => {
                    dispatch(setRemoteUid(0));
                },
            });

            agoraEngine.enableVideo();
        } catch (e) {
            console.log(e);
        }
    };

    const goLive = async liveData => {
        const {token, generateUid} = await live.getAgoraToken(
            liveData.live_name,
        );
        if (isJoin) {
            return;
        }

        const uid = +generateUid;
        try {
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileLiveBroadcasting,
            );

            await agoraEngineRef.current?.joinChannel(
                token,
                liveData.live_name,
                uid,
                {
                    clientRoleType: ClientRoleType.ClientRoleAudience,
                },
            );

            socket.emit('joinChannel', {liveData, user});
            dispatch(setIsJoin(true));
            navigation.navigate('LiveScreen');
        } catch (e) {
            console.log(e);
        }
    };

    const goOut = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            dispatch(setIsGone(false));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}
                    contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.onGoingLive}>
                            {isLoading ? (
                                <View
                                    style={{
                                        height: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator
                                        size="large"
                                        color="black"
                                    />
                                </View>
                            ) : onGoingLives.length ? (
                                <>
                                    {onGoingLives.map((live, id) => (
                                        <LiveCard
                                            key={id}
                                            sellerName={live.sellerName}
                                            datetime={live.live_date_time}
                                            description={live.live_description}
                                            category={live.business_activity}
                                            status={live.live_status}
                                            onPress={() => goLive(live)}
                                            imageUrl={live.imageUrl || ''}
                                        />
                                    ))}
                                    <View
                                        style={{
                                            width: 150,
                                            height: 230,
                                            margin: 10,
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                </>
                            ) : (
                                <NoData
                                    title={'Aucun lives en cours'}
                                    message={
                                        'Les lives en cours apparaîtront ici, reviens un peu plus tard.'
                                    }
                                    buttonTitle={''}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    onGoingLive: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: 10,
    },
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 350,
        textAlign: 'center',
    },
    headlineMessage: {
        color: colors.DARK,
        fontFamily: 'FugazOne-Regular',
        fontSize: 30,
        textAlign: 'center',
    },
    fieldContainer: {margin: 10, marginBottom: 30},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        width: 350,
        textAlign: 'left',
    },
    action: {},
    resetPassword: {color: 'white'},
});

export default LivesScreen;
