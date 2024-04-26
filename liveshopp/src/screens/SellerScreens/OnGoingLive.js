import React, {useState} from 'react';
import {REACT_APP_AGORA_APP_ID} from '@env';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Pressable,
    ImageBackground,
    PermissionsAndroid,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import colors from '../../styles/colors';
import ContainedButtonSm from '../../components/ContainedButtonSm/ContainedButtonSm';
import {useDispatch, useSelector} from 'react-redux';
import {
    ChannelProfileType,
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
} from 'react-native-agora';
import {setIsJoin, setSellerLives} from '../../redux/slices/livesSlice';
import live from '../../services/live';
import {DateTime} from 'luxon';
import socket from '../../services/config/clientSocketIoConfig';
import Toast from 'react-native-toast-message';
import NoData from '../../components/NoData/NoData';

export const OnGoingLive = ({navigation}) => {
    const agoraEngineRef = IRtcEngine;
    const {sellerLives, isJoin, isGone, liveData} = useSelector(
        state => state.lives,
    );
    const {user} = useSelector(state => state.user);

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [liveToClose, setLiveToClose] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            // Initialize Agora engine when the app starts
            if (isGone) {
                goOut();
            }
        }, [isGone]),
    );

    useFocusEffect(
        React.useCallback(() => {
            setupVideoSDKEngine()
                .then(r => r)
                .catch(err => err);
        }, []),
    );

    const getPermission = async () => {
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
                await getPermission();
            }

            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            agoraEngine.initialize({
                appId: REACT_APP_AGORA_APP_ID,
                channelProfile:
                    ChannelProfileType.ChannelProfileLiveBroadcasting,
            });

            agoraEngine.enableVideo();
            agoraEngine.enableAudio();
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

            agoraEngineRef.current?.startPreview();
            agoraEngineRef.current?.joinChannel(
                token,
                liveData.live_name,
                0,
                {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                },
            );

            socket.emit('joinChannel', {liveData, user});
            dispatch(setIsJoin(true));
            navigation.navigate('LiveScreen');
        } catch (e) {
            console.log(e);
        }
    };

    const goOut = async () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            agoraEngineRef.current?.stopPreview();
            dispatch(setIsJoin(false));
        } catch (e) {
            console.log(e);
        }
    };

    const closeLive = () => {
        setIsLoading(true);
        live.closeLive(liveToClose)
            .then(res => res)
            .then(data => {
                setIsLoading(false);
                setModalVisible(!modalVisible);
                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                dispatch(setSellerLives(data.lives));
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}>
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.60)',
                                }}>
                                <View
                                    style={{
                                        height: 130,
                                        width: 220,
                                        borderRadius: 10,
                                        backgroundColor: colors.LIGHT,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10,
                                    }}>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                textAlign: 'center',
                                                fontFamily: 'FugazOne-Regular',
                                            }}>
                                            CLÔTURÉ LE LIVE :{' '}
                                        </Text>
                                        <Text style={{fontSize: 15, margin: 5}}>
                                            {liveToClose.live_name}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}>
                                        <View style={{margin: 10, height: 30}}>
                                            <TouchableOpacity
                                                style={{
                                                    height: 40,
                                                    width: 70,
                                                    backgroundColor: 'black',
                                                    borderRadius: 10,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={closeLive}>
                                                <Text
                                                    style={{
                                                        color: colors.LIGHT,
                                                        textAlign: 'center',
                                                        fontSize: 20,
                                                    }}>
                                                    oui
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                margin: 10,
                                                borderRadius: 10,
                                                height: 30,
                                            }}>
                                            <TouchableOpacity
                                                style={{
                                                    height: 40,
                                                    width: 70,
                                                    backgroundColor: 'black',
                                                    borderRadius: 10,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() =>
                                                    setModalVisible(
                                                        !modalVisible,
                                                    )
                                                }>
                                                <Text
                                                    style={{
                                                        color: colors.LIGHT,
                                                        textAlign: 'center',
                                                        fontSize: 20,
                                                    }}>
                                                    non
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </Modal>
                        <View style={styles.onGoingLive}>
                            {sellerLives.filter(
                                live => live.live_status === 'live',
                            ).length && !isLoading ? (
                                sellerLives
                                    .filter(live => live.live_status === 'live')
                                    .map((live, id) => (
                                        <View
                                            key={id}
                                            style={{
                                                backgroundColor: 'black',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '85%',
                                                width: 350,
                                                borderRadius: 10,
                                            }}>
                                            <Pressable
                                                style={
                                                    styles.onGoingLiveContainer
                                                }
                                                onPress={() => {
                                                    setModalVisible(
                                                        !modalVisible,
                                                    );
                                                    setLiveToClose(live);
                                                }}>
                                                <ImageBackground
                                                    source={
                                                        user.imageUrl
                                                            ? {
                                                                  uri: user.imageUrl,
                                                              }
                                                            : require('../../../assets/images/liveshopp_back_lives.png')
                                                    }
                                                    borderRadius={10}
                                                    imageStyle={{
                                                        opacity: 0.3,
                                                        borderRadius: 15,
                                                    }}>
                                                    <View
                                                        style={
                                                            styles.liveContainer
                                                        }>
                                                        <View
                                                            style={
                                                                styles.liveContainerInfos
                                                            }>
                                                            <View
                                                                style={
                                                                    styles.liveContainerInfosIcons
                                                                }>
                                                                <View
                                                                    style={{
                                                                        borderColor: colors.PRIMARY,
                                                                        borderWidth: 1,
                                                                        textAlign: 'left',
                                                                        fontWeight: 'bold',
                                                                        fontSize: 13,
                                                                        backgroundColor: colors.PRIMARY,
                                                                        padding: 4,
                                                                        paddingRight: 10,
                                                                        paddingLeft: 10,
                                                                        borderRadius: 4,
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            textAlign: 'left',
                                                                            fontWeight: 'bold',
                                                                            color: colors.LIGHT,
                                                                            fontSize: 12,
                                                                        }}>
                                                                        En direct
                                                                    </Text>
                                                                </View>
                                                                <Text
                                                                    style={
                                                                        styles.liveContainerUsers
                                                                    }>
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faUsers
                                                                        }
                                                                        color={
                                                                            colors.LIGHT
                                                                        }
                                                                        size={
                                                                            20
                                                                        }
                                                                    />{' '}
                                                                    {
                                                                        liveData.userCount
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={
                                                                    styles.liveContainerLiveInfos
                                                                }>
                                                                <Text
                                                                    style={
                                                                        styles.title
                                                                    }>
                                                                    {
                                                                        live.live_name
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    numberOfLines={
                                                                        5
                                                                    }
                                                                    style={
                                                                        styles.description
                                                                    }>
                                                                    {
                                                                        live.live_description
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    style={
                                                                        styles.hour
                                                                    }>
                                                                    {DateTime.fromISO(
                                                                        live.live_date_time,
                                                                    ).toLocaleString(
                                                                        DateTime.DATE_MED_WITH_WEEKDAY,
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.action}>
                                                        <ContainedButtonSm
                                                            title="Rejoindre le live"
                                                            loading={isLoading}
                                                            onPress={() =>
                                                                goLive(live)
                                                            }
                                                        />
                                                    </View>
                                                </ImageBackground>
                                            </Pressable>
                                        </View>
                                    ))
                            ) : !sellerLives.filter(
                                  live => live.live_status === 'live',
                              ).length && !isLoading ? (
                                <NoData
                                    title={"Vous n'avez aucun live en cours"}
                                    message={
                                        'Un live programmé apparaîtra ici 30 min avant que le show commence.'
                                    }
                                    buttonTitle={'Créer un live maintenant ?'}
                                    onPress={() =>
                                        navigation.navigate('SettingNewLive')
                                    }
                                />
                            ) : (
                                <View
                                    style={{
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.DARK}
                                    />
                                </View>
                            )}
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    liveContainerInfos: {
        alignItems: 'center',
    },
    onGoingLiveContainer: {
        backgroundColor: 'transparent',
    },
    onGoingLive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    liveContainer: {
        width: 350,
        textAlign: 'center',
        height: '85%',
        flex: 1,
        justifyContent: 'space-between',
        borderRadius: 15,
    },
    liveContainerUsers: {
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        color: colors.LIGHT,
    },
    liveContainerIcon: {
        fontFamily: 'Roboto-Regular',
        fontSize: 25,
        color: colors.LIGHT,
    },
    title: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 25,
        margin: 5,
        alignItems: 'center',
    },
    description: {
        fontSize: 15,
        marginTop: 30,
        color: colors.LIGHT,
        textAlign: 'center',
        width: 300,
    },
    hour: {
        fontSize: 20,
        marginTop: 30,
        fontWeight: 500,
        color: colors.LIGHT,
    },
    liveContainerLiveInfos: {
        alignItems: 'center',
        marginTop: 70,
    },
    action: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    liveContainerInfosIcons: {
        marginTop: 25,
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default OnGoingLive;
