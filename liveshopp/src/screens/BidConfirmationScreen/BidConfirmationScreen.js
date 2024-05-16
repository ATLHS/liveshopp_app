import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Image,
    Vibration,
} from 'react-native';
import colors from '../../styles/colors';
import {useDispatch} from 'react-redux';

export const BidConfirmationScreen = ({navigation, route}) => {
    const dispatch = useDispatch();
    const [selectedOffer, setSelectedOffer] = useState({});

    useEffect(() => {
        const {selectedOfferParams} = route.params;
        setSelectedOffer(selectedOfferParams);
        Vibration.vibrate(1 * 1000);
    }, [selectedOffer, route.params]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.welcomeContainer}>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 40,
                            }}>
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: 900,
                                }}>
                                Félicitations!
                            </Text>
                            <View style={{marginTop: 20}}>
                                <Image
                                    style={{
                                        height: 110,
                                        width: 110,
                                        transform: [{rotate: '10deg'}],
                                    }}
                                    source={require('../../../assets/images/auction_hammer.png')}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 60,
                            }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    textAlign: 'center',
                                    width: 320,
                                    color: 'grey',
                                    marginBottom: 15,
                                }}>
                                Vous êtes maintenant dans la course pour
                            </Text>
                            <Text
                                style={{
                                    fontSize: 25,
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    width: 320,
                                    color: 'black',
                                    marginBottom: 15,
                                }}>
                                {selectedOffer.productName}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    textAlign: 'center',
                                    width: 320,
                                    color: 'grey',
                                    marginBottom: 15,
                                }}>
                                {' '}
                                À la fin de l'enchère, nous vous révélerons si
                                vous avez atteint le prix de réserve fixé par le
                                vendeur.
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    textAlign: 'center',
                                    width: 320,
                                    color: 'grey',
                                    marginBottom: 15,
                                }}>
                                Bonne chance !
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headlineContainer: {marginBottom: 30, color: 'black'},
    welcomeContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    fieldContainer: {margin: 10},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'FugazOne-Regular',
        fontSize: 30,
        width: 280,
        textAlign: 'center',
    },
});

export default BidConfirmationScreen;
