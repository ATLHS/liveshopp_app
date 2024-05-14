import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
} from 'react-native';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import {useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import {useDispatch, useSelector} from 'react-redux';
import {DateTime} from 'luxon';
import Toast from 'react-native-toast-message';
import {setSellerAuctionVideos} from '../../redux/slices/auctionsVideoSlice';
import auctionVideos from '../../services/auctionVideos';

const auctionVideoFormSchema = () => [
    {
        name: 'productName',
        label: "Nom de l'article",
        type: 'text',
        validation: {
            required: {
                value: true,
                message: "Veuillez indiquer le nom de l'article.",
            },
            pattern: {
                value: /^[a-zA-Z\s0-9.]*$/i,
                message:
                    "Les caractères autorisés pour le nom de l'article sont : \n- Majuscules - Minuscules - Chiffres",
            },
        },
        editable: true,
        defaultValue: '',
    },
    {
        name: 'productDescription',
        label: 'Description',
        type: 'textarea',
        validation: {
            required: {
                value: true,
                message: "Veuillez indiquer la description de l'article.",
            },
        },
        editable: true,
        defaultValue: '',
    },
    {
        name: 'startingPrice',
        label: 'Prix de départ (montant initial de la vente)',
        type: 'text',
        keyboardType: 'numeric',
        validation: {
            required: {
                value: true,
                message: "Veuillez indiquer le prix de départ de l'enchere.",
            },
        },
        editable: true,
        defaultValue: '',
        // inline: true,
    },
    {
        name: 'reservePrice',
        label: 'Prix de réserve (montant minimum pour la vente)',
        type: 'text',
        keyboardType: 'numeric',
        validation: {
            required: {
                value: true,
                message: "Veuillez indiquer le prix de réserve de l'enchere.",
            },
            validate: (_, b) => {
                if (b.reservePrice) {
                    return Number(b.startingPrice) < Number(b.reservePrice)
                        ? true
                        : 'Le prix de réserve doit être supérieur au prix de départ.';
                }
                return true;
            },
        },
        editable: true,
        defaultValue: '',
        // inline: true,
    },
    {
        name: 'live_date_time',
        label: 'date',
        type: 'datetime',
        style: {height: 110, width: 350},
        minimumDelay: DateTime.now()
            .setZone('Europe/Paris')
            .startOf('minutes') // Début de l'heure actuelle
            .plus({days: 0, minutes: 30 - (DateTime.now().minute % 30)})
            .toJSDate(),
        minuteInterval: 30,
        helperMessage: "Date et heure de clôture de l'enchère 3 jours minimum.",
    },
    {
        name: 'videoUrl',
        label: 'En quoi ton live sera unique ?',
        type: 'video',
        editable: true,
        validation: {
            required: {
                value: true,
                message: "Veuillez ajouter une vidéo pour l'article",
            },
        },
    },
];

export const SetNewAuctionVideo = ({navigation}) => {
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleAuctionVideoCreation = data => {
        setIsLoading(true);
        auctionVideos
            .createNewAuctionVideo(data)
            .then(res => res)
            .then(data => {
                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                dispatch(
                    setSellerAuctionVideos(
                        data.auctionVideos.filter(
                            auctionVideo =>
                                auctionVideo.auctionStatus === 'onGoing',
                        ),
                    ),
                );
                setIsLoading(false);
                navigation.goBack();
            })
            .catch(err => {
                Toast.show({
                    type: 'toastError',
                    text1: err.message,
                });
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    contentInset={{bottom: 50}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.formContainer}>
                            <View style={styles.fieldContainer}>
                                <FieldWrapper
                                    control={control}
                                    schema={auctionVideoFormSchema()}
                                />
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Démarrer l'enchère vidéo"
                                    onPress={handleSubmit(
                                        handleAuctionVideoCreation,
                                    )}
                                    loading={isLoading}
                                />
                            </View>
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
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 50,
        alignItems: 'center',
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 350,
        textAlign: 'center',
    },
    headlineMessage: {
        color: colors.DARK,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    fieldContainer: {margin: 10, marginBottom: 0},
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

export default SetNewAuctionVideo;
