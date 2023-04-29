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
import customer from '../../services/customer';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {setUser} from '../../redux/slices/userSlice';

export const SettingProfilScreen = ({navigation}) => {
    const {user} = useSelector(state => state.user);

    const SettingProfilScreenFormUser = [{
        name: 'lastname', label: 'Nom', type: 'text', validation: {
            required: {
                value: true, message: 'Veuillez indiquer votre nom.',
            },
        }, editable: true, defaultValue: user.lastname,
    }, {
        name: 'firstname', label: 'Prénom', type: 'text', validation: {
            required: {
                value: true, message: 'Veuillez indiquer votre prénom.',
            },
        }, editable: true, defaultValue: user.firstname,
    }, {
        name: 'email', label: 'Email', type: 'text', validation: {
            required: {
                value: true, message: 'Veuillez indiquer votre adresse e-mail.',
            }, pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Veuillez indiquer une adresse e-mail valide.',
            },
        }, editable: false, defaultValue: user.email,
    },];

    const SettingProfilScreenFormSeller = [{
        name: 'lastname', label: 'Nom', type: 'text', validation: {
            required: {
                value: true, message: 'Veuillez indiquer votre nom.',
            },
        }, editable: true, defaultValue: user.lastname,
    }, {
        name: 'firstname', label: 'Prénom', type: 'text', validation: {
            required: {
                value: true, message: 'Veuillez indiquer votre prénom.',
            },
        }, editable: true, defaultValue: user.firstname,
    }, {
        name: 'company_name', label: user.company_name, type: 'text', editable: false, defaultValue: user.company_name,
    }, {
        name: 'business_activity',
        label: user.business_activity,
        type: 'select',
        editable: true,
        defaultValue: user.business_activity,
    }, {
        name: 'role',
        label: user.role,
        type: 'select',
        options: ['Direction', 'Marketing', 'Commercial', 'R&D'],
        editable: true,
        defaultValue: user.role,
    }, {
        name: 'phone', label: 'Numéro de téléphone mobile', type: 'tel', validation: {
            required: {
                value: true, message: 'Veuillez indiquer un numéro de téléphone.',
            }, pattern: {
                value: /^[0-9]+$/ && /^0[67]\d{8}$/, message: 'Veuillez indiquer un numéro valide.',
            },
        }, options: ['Direction', 'Marketing', 'Commercial', 'R&D'], editable: true, defaultValue: user.phone,
    }, {
        name: 'email', label: user.email, type: 'text', editable: false, defaultValue: user.email,
    },];

    const schemaForm = user.profil === 'seller' ? SettingProfilScreenFormSeller : SettingProfilScreenFormUser;

    const {handleSubmit, control} = useForm({
        defaultValues: {
            firstname: user.firstname,
            lastname: user.lastname,
            company_name: user.company_name || null,
            business_activity: user.business_activity || null,
            role: user.role || null,
            phone: user.phone || null,
            email: user.email,
        },
    });
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleProfilSetting = data => {
        setIsLoading(true);
        customer
            .updateCustomerProfil(data)
            .then(res => res)
            .then(data => {
                Toast.show({
                    type: 'success', text1: data.message,
                });
                dispatch(setUser(data.user));
                setIsLoading(false);
                navigation.goBack();
            })
            .catch(err => {
                Toast.show({
                    type: 'error', text1: err.message,
                });
                setIsLoading(false);
            });
    };

    return (<SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                contentInset={{bottom: 100}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.formContainer}>
                        <View style={styles.headlineContainerMessage}>
                            <Text style={styles.headlineMessage}>{message}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <FieldWrapper control={control} schema={schemaForm}/>
                        </View>
                        <View style={styles.action}>
                            <ContainedButton
                                title="Valider"
                                onPress={handleSubmit(handleProfilSetting)}
                                loading={isLoading}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, headlineContainer: {marginBottom: 30}, formContainer: {
        flex: 1, backgroundColor: 'white', alignItems: 'center',
    }, headlineContainerMessage: {
        marginBottom: 30, width: 350, textAlign: 'center',
    }, headlineMessage: {color: colors.DARK}, fieldContainer: {margin: 10, marginBottom: 30}, headline: {
        color: colors.LIGHT, fontFamily: 'Roboto-Regular', fontSize: 30, width: 350, textAlign: 'left',
    }, action: {}, resetPassword: {color: 'white'},
});

export default SettingProfilScreen;
