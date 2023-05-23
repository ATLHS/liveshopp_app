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
    TouchableOpacity,
} from 'react-native';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import {useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import auth from '../../services/auth';

const UserSignupFormSchema = [
    {
        name: 'lastname',
        label: 'Nom',
        type: 'text',
        autoFocus: true,
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre nom.',
            },
        },
    },
    {
        name: 'firstname',
        label: 'Prénom',
        type: 'text',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre prénom.',
            },
        },
    },
    {
        name: 'email',
        label: 'Email',
        type: 'text',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre adresse e-mail.',
            },
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Veuillez indiquer une adresse email valide.',
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
        name: 'eula',
        label: '',
        type: 'checkbox',
        validation: {
            required: {
                value: true,
                message: 'Veuillez accepter les conditions générales d’utilisation.',
            },
        },
        helper: {
            helperLink: 'rgpdScreen',
            helperMessage1: 'En cliquant sur "Let\'s go" j\'accepte les ',
            helperMessage2: 'de Liveshopp et confirme avoir plus de 16 ans.'
        }
    },
];

export const UserSignUp = ({navigation}) => {
    const {handleSubmit, control} = useForm();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUserSignup = data => {
        setIsLoading(true);
        auth
            .handleUserSignup(data)
            .then(res => res)
            .then(data => {
                setMessage(data.message);
                setIsLoading(false);
                navigation.navigate('EmailVerificationCode', {
                    message: data.message,
                    user_id: data.user.id,
                });
            })
            .catch(err => {
                setMessage(err.message);
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView style={{marginBottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.formContainer}>
                            <View style={styles.headlineContainer}>
                                <Text style={styles.headline}>
                                    Faire une bonne affaire n’a jamais était aussi simple.
                                </Text>
                            </View>
                            <View style={styles.headlineContainerMessage}>
                                <Text style={styles.headlineMessage}>{message}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <FieldWrapper control={control} schema={UserSignupFormSchema}/>
                            </View>
                            <View style={styles.action}>
                                <ContainedButton
                                    title="Let’s go !"
                                    onPress={handleSubmit(handleUserSignup)}
                                    loading={isLoading}
                                />
                            </View>
                            <View style={styles.sellerSignupCta}>
                                <TouchableOpacity
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        flexDirection: 'row',
                                    }}
                                    onPress={() => navigation.replace('SellerSignup')}>
                                    <Text style={{color: 'white', fontSize: 17, marginRight: 5}}>
                                        Vendre
                                    </Text>
                                    <FontAwesomeIcon
                                        icon={faAnglesRight}
                                        color={colors.LIGHT}
                                        size={20}
                                    />
                                </TouchableOpacity>
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
    sellerSignupCta: {
        marginTop: 20,
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
        width: 350,
    },
    headlineMessage: {color: colors.LIGHT, textAlign: 'left'},
    fieldContainer: {margin: 10},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        width: 350,
        textAlign: 'left',
    },
    action: {},
    resetPassword: {color: 'white'},
    conditionText: {color: 'white'},
    condition: {width: 350, marginBottom: 30, marginTop: 30},
});

export default UserSignUp;
