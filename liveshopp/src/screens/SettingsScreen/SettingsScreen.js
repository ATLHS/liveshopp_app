import React, {useState} from 'react';
import {REACT_APP_LIVESHOPP_CONTACT, REACT_APP_STRIPE_PUBLIC_KEY} from '@env';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
} from 'react-native';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Touchable from '../../components/Auth/Touchable/Touchable';
import Headline from '../../components/Auth/Headine/Headline';
import {setIsAuthenticate, setUser} from '../../redux/slices/userSlice';
import email from 'react-native-email';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import stripe from '../../services/stripe';
import customer from '../../services/customer';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import colors from '../../styles/colors';

function SettingsScreen({navigation}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useSelector(state => state.user);
    const [modalVisible, setModalVisible] = useState(false);
    const {initialOrder} = useSelector(state => state.order);

    const handleSignOut = async () => {
        await AsyncStorage.removeItem('@token');
        dispatch(setIsAuthenticate(false));
        dispatch(setUser({profil: null}));
    };

    const goToProfilSetting = () => {
        navigation.navigate('SettingProfilScreen');
    };

    const goSettingShippingAddress = () => {
        navigation.navigate('SettingShippingAddress');
    };

    const goToBlockedUsers = () => {
        navigation.navigate('BlockedUsers');
    };

    const goToAdminBlockedUsers = () => {
        navigation.navigate('AdminBlockedUsers');
    };

    const goToAdminFlaggedUsers = () => {
        navigation.navigate('AdminSignaledUsers');
    };

    const handleEmail = () => {
        const to = [REACT_APP_LIVESHOPP_CONTACT];
        email(to, {
            subject: `Message de ${user.company_name || user.firstname}`,
            checkCanOpen: false,
        }).catch(console.error);
    };

    const goToRGPD = () => {
        navigation.navigate('rgpdScreen');
    };

    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(false);

    const fetchPaymentSheetParams = async () => {
        return stripe
            .fetchPaymentSheet()
            .then(res => res)
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
            });
    };

    const initializePaymentSheet = async () => {
        const {setupIntent, ephemeralKey, customer} =
            await fetchPaymentSheetParams();
        const {error} = await initPaymentSheet({
            merchantDisplayName: 'Liveshopp',
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            setupIntentClientSecret: setupIntent,
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const {error} = await presentPaymentSheet();

        if (error) {
            console.error(error.message);
        } else {
            customer
                .updateCustomerPaymentMethodStatut()
                .then(res => res)
                .then(data => {
                    dispatch(setUser(data.user));
                    Toast.show({
                        type: 'success',
                        text1: data.message,
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };
    const deleteCustomerProfil = async () => {
        customer
            .deleteCustomer(user.id)
            .then(res => res)
            .then(data => {
                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                handleSignOut();
            })
            .catch(err => {
                setModalVisible(!modalVisible);
                Toast.show({
                    type: 'toastError',
                    text1: err.message,
                });
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            initializePaymentSheet();
        }, []),
    );

    return (
        <StripeProvider publishableKey={REACT_APP_STRIPE_PUBLIC_KEY}>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInset={{bottom: 100}}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.container}>
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
                                                height: 200,
                                                width: 250,
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
                                                        fontFamily:
                                                            'FugazOne-Regular',
                                                    }}>
                                                    SUPPRIMER MON PROFIL ?{' '}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        margin: 5,
                                                        color: colors.PRIMARY,
                                                        textAlign: 'center',
                                                    }}>
                                                    {initialOrder.length &&
                                                    initialOrder.filter(
                                                        order =>
                                                            order.userId ===
                                                                user.id ||
                                                            (order.sellerId ===
                                                                user.id &&
                                                                order.deliveryStatut ===
                                                                    "En attente d'expédition") ||
                                                            order.deliveryStatut ===
                                                                'Expédié',
                                                    ).length
                                                        ? "Attention ! des articles sont en attente d'expédition ou en cours d'expédition. Cette action supprime l'intégralité de vos données sans exception, et est définitive."
                                                        : "Attention ! Cette action supprime l'intégralité de vos données sans exception, et est définitive."}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                }}>
                                                <View
                                                    style={{
                                                        margin: 10,
                                                        height: 30,
                                                    }}>
                                                    <TouchableOpacity
                                                        style={{
                                                            height: 40,
                                                            width: 70,
                                                            backgroundColor:
                                                                'black',
                                                            borderRadius: 10,
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                        onPress={
                                                            deleteCustomerProfil
                                                        }>
                                                        <Text
                                                            style={{
                                                                color: colors.LIGHT,
                                                                textAlign:
                                                                    'center',
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
                                                            backgroundColor:
                                                                'black',
                                                            borderRadius: 10,
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                        onPress={() =>
                                                            setModalVisible(
                                                                !modalVisible,
                                                            )
                                                        }>
                                                        <Text
                                                            style={{
                                                                color: colors.LIGHT,
                                                                textAlign:
                                                                    'center',
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
                                <Headline title={'Mon profil'} />
                                {user.profil === 'admin' && (
                                    <>
                                        <View style={{marginBottom: 10}}>
                                            <Text style={{fontSize: 17}}>
                                                Type : Admin
                                            </Text>
                                            <Text style={{fontSize: 17}}>
                                                Nom : {user.firstname}
                                            </Text>
                                            <Text style={{fontSize: 17}}>
                                                Prénom : {user.lastname}
                                            </Text>
                                        </View>

                                        <Touchable
                                            title={
                                                'Utilisateurs bloqués sur Liveshopp'
                                            }
                                            onPress={goToAdminBlockedUsers}
                                        />
                                        <Touchable
                                            title={
                                                'Utilisateurs signalé sur Liveshopp'
                                            }
                                            onPress={goToAdminFlaggedUsers}
                                        />
                                    </>
                                )}
                                {user.profil !== 'admin' && (
                                    <>
                                        <Touchable
                                            title={'Modifier mon profil'}
                                            onPress={goToProfilSetting}
                                        />
                                        <Touchable
                                            title={'Moyen de paiement'}
                                            onPress={openPaymentSheet}
                                        />
                                        <Touchable
                                            title={'Adresse de livraison'}
                                            onPress={goSettingShippingAddress}
                                        />
                                        <Touchable
                                            title={'Utilisateurs bloqués'}
                                            onPress={goToBlockedUsers}
                                        />
                                        <Headline title={'CGV'} />
                                        <Touchable
                                            title={'Conditions Générales'}
                                            onPress={goToRGPD}
                                        />
                                        <Headline title={'Contact'} />
                                        <Touchable
                                            title={'Nous contacter'}
                                            onPress={handleEmail}
                                        />
                                    </>
                                )}
                                <ContainedButton
                                    title="Déconnexion"
                                    onPress={handleSignOut}
                                    loading={isLoading}
                                />
                                <View style={{marginTop: 20}}>
                                    <Touchable
                                        title={'Supprimer mon profil'}
                                        onPress={() =>
                                            setModalVisible(!modalVisible)
                                        }
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </StripeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 350,
    },
});

export default SettingsScreen;
