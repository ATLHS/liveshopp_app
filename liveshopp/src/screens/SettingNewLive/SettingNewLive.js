import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
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
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {setSellerLives} from '../../redux/slices/livesSlice';
import {DateTime} from 'luxon';
import seller from '../../services/seller';

const LiveCreationFormSchema = () => [
    {
        name: 'live_name',
        label: 'Nom du live',
        type: 'text',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer le nom du live.',
            },
        },
        editable: true,
        defaultValue: '',
    },
    {
        name: 'live_description',
        label: 'En quoi ton live sera unique ?',
        type: 'textarea',
        editable: true,
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer une description.',
            },
        },
    },
    {
        name: 'live_date_time',
        label: 'date',
        type: 'datetime',
    },
];

export const SettingNewLive = ({navigation}) => {
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleLiveCreation = data => {
        setIsLoading(true);
        data.live_date_time =
            data.live_date_time == null
                ? DateTime.now().plus({minutes: 30}).toLocal().toJSDate()
                : data.live_date_time;
        seller
            .createNewLive(data)
            .then(res => res)
            .then(data => {
                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                dispatch(setSellerLives(data.lives));
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
                    contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.formContainer}>
                            {/*<View style={styles.headlineContainerMessage}>
                                <Text style={styles.headlineMessage}>CRÉE UN NOUVEAU LIVE</Text>
                            </View>*/}
                            <View style={styles.fieldContainer}>
                                <FieldWrapper
                                    control={control}
                                    schema={LiveCreationFormSchema()}
                                />
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Crée le live"
                                    onPress={handleSubmit(handleLiveCreation)}
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
        alignItems: 'center',
        marginTop: 50
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

export default SettingNewLive;
