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
import auth from "../../services/auth";

const ResetCustomerPasswordSchema = [
    {
        name: 'password_1',
        label: 'Nouveau mot de passe',
        type: 'password',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer un mot de passe.',
            },
            pattern: {
                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                message: 'Veuillez indiquer un mot de passe valide.',
            },
        },
        helper:
            'Au moins 8 caractères, dont 1 majuscule, 1 minuscule et 1 chiffre et c’est tout..',
    },
    {
        name: 'password_2',
        label: 'Confirmation du nouveau mot de passe',
        type: 'password',
        validation: {
            required: {
                value: false,
                message: 'Veuillez confirmer le mot de passe.',
            },
            pattern: {
                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                message: 'Veuillez indiquer un mot de passe valide.',
            },
            validate: (_, b) =>  b.password_1 === b.password_2 || 'Les mots de passe doivent être identiques.',
        },
        helper:
            '',
    },
];

export const ResetCustomerPassword = ({navigation, route}) => {
    const {handleSubmit, control, watch} = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {user_id} = route.params;

    const handleResetCustomerPassword = data => {
        setIsLoading(false);
        data.id = user_id;

        auth
            .resetCustomerPassword(data)
            .then(res => res)
            .then(data => {
                setIsLoading(false);
                navigation.navigate('SignIn', {
                    message: data.message,
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
                <ScrollView
                    contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.formContainer}>
                            <View style={styles.headlineContainer}>
                                <Text style={styles.headline}>
                                    Saisissez un nouveau mot de passe.
                                </Text>
                            </View>
                            <View style={styles.errorHelper}>
                                <Text style={styles.errorHelperText}>{errorMessage}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <FieldWrapper
                                    control={control}
                                    schema={ResetCustomerPasswordSchema}
                                />
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Valider"
                                    onPress={handleSubmit(handleResetCustomerPassword)}
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

export default ResetCustomerPassword;
