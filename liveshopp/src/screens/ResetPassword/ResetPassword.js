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
import auth from '../../services/auth';

const ResetPasswordSchema = [
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        autoFocus: true,
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre adresse e-mail.',
            },
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Veuillez indiquer une adresse e-mail valide.',
            },
        },
    },
];

export const ResetPassword = ({navigation}) => {
    const {handleSubmit, control} = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailVerificationCode = data => {
        setIsLoading(true);
        auth.resetPassword(data)
            .then(res => res)
            .then(data => {
                setIsLoading(false);
                navigation.navigate('EmailVerificationCode', {
                    message: data.message,
                    user_id: data.user.id,
                    resetPassword: true,
                });
            })
            .catch(err => {
                setErrorMessage(err.message);
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.formContainer}>
                            <View style={styles.headlineContainer}>
                                <Text style={styles.headline}>
                                    Réinitialiser le mot de passe.
                                </Text>
                            </View>
                            <View style={styles.helper}>
                                <Text style={styles.helperText}>
                                    Entrez l'adresse e-mail liée à votre compte.
                                    Nous vous enverrons un code par e-mail pour
                                    réinitialiser votre mot de passe.
                                </Text>
                            </View>
                            <View style={styles.errorHelper}>
                                <Text style={styles.errorHelperText}>
                                    {errorMessage}
                                </Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <FieldWrapper
                                    control={control}
                                    schema={ResetPasswordSchema}
                                />
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Valider"
                                    onPress={handleSubmit(
                                        handleEmailVerificationCode,
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
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    fieldContainer: {margin: 10},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        textAlign: 'left',
        width: 350,
    },
    action: {},
    resetPassword: {color: 'white'},
    helperText: {color: 'white', textAlign: 'left', width: 350},
    helper: {wwidth: 350, marginBottom: 10},
    errorHelper: {width: 350, marginBottom: 10, textAlign: 'left'},
    errorHelperText: {color: colors.PRIMARY},
});

export default ResetPassword;
