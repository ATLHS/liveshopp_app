import React, {useEffect, useState} from 'react';
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
import auth from '../../services/auth';
import {setUser, setIsAuthenticate} from '../../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosConfig from '../../services/config/axiosConfig';

const signInFormSchema = [
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
    {
        name: 'password',
        label: 'Mot de passe',
        type: 'password',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre mot de passe.',
            },
        },
    },
];

export const SignIn = ({navigation, route}) => {
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (route.params && route.params.message)
            setMessage(route.params.message);
    }, [route]);

    const handleSignin = data => {
        setIsLoading(false);
        auth.handleUserSignIn(data)
            .then(res => res)
            .then(data => {
                setIsLoading(false);
                if (data.user.isBanned) {
                    return setMessage(
                        "Votre compte a été bloqué par Liveshopp, veuillez contacter notre équipe pour plus d'information, merci.",
                    );
                }
                AsyncStorage.setItem('@token', data.token).then(r => {
                    axiosConfig.defaults.headers.Authorization = `Bearer ${data.token}`;
                    dispatch(setUser(data.user));
                    dispatch(setIsAuthenticate(true));
                });
            })
            .catch(err => {
                console.error(err);
                setMessage(err.message);
                setIsLoading(false);
            });
    };

    const goToResetPassword = () => {
        navigation.navigate('ResetPassword');
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
                                    Welcome back !
                                </Text>
                            </View>
                            <View style={styles.headlineContainerMessage}>
                                <Text style={styles.headlineMessage}>
                                    {message}
                                </Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <FieldWrapper
                                    control={control}
                                    schema={signInFormSchema}
                                />
                            </View>

                            <View style={styles.helper}>
                                <TouchableWithoutFeedback
                                    onPress={() => goToResetPassword()}>
                                    <Text style={styles.helperText}>
                                        Mot de passe oublié ?
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Connexion"
                                    onPress={handleSubmit(handleSignin)}
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
    headlineContainerMessage: {
        marginBottom: 30,
        width: 280,
        textAlign: 'center',
    },
    headlineMessage: {color: colors.LIGHT},
    fieldContainer: {margin: 10, marginBottom: 0},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
    },
    action: {},
    resetPassword: {color: 'white'},
    helperText: {
        color: 'white',
        textAlign: 'left',
        width: 350,
        textDecorationLine: 'underline',
    },
    helper: {width: 350, position: 'relative', top: -20},
});

export default SignIn;
