import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import {useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import customer from '../../services/customer';
import {useDispatch} from 'react-redux';
import {store} from '../../redux/store';
import Toast from 'react-native-toast-message';
import {setUser} from '../../redux/slices/userSlice';

const ShippingAddressFormSchema = () => [
    {
        name: 'shipping_address',
        label: 'Adresse de livraison',
        type: 'places',
        validation: {
            required: {
                value: true,
                message: 'Veuillez indiquer votre adresse de livraison.',
            },
        },
        editable: true,
    },
];

export const SettingShippingAddress = ({navigation}) => {
    const {handleSubmit, control} = useForm({
        defaultValues: {
            shipping_address: store.getState().user.user.shipping_address,
        },
    });

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleShippingAddress = data => {
        setIsLoading(false);
        customer
            .updateCustomerShippingAdrress(data)
            .then(res => res)
            .then(data => {
                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                dispatch(setUser(data.user));
                setIsLoading(false);
                navigation.goBack();
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.formContainer}>
                        <View style={styles.places}>
                            <FieldWrapper
                                control={control}
                                schema={ShippingAddressFormSchema()}
                            />
                        </View>
                        <View style={styles.action}>
                            <ContainedButton
                                title="Valider"
                                onPress={handleSubmit(handleShippingAddress)}
                                loading={isLoading}
                            />
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
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    places: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 3,
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 350,
        textAlign: 'center',
    },
    headlineMessage: {color: colors.DARK},
    fieldContainer: {margin: 10, marginBottom: 30, height: 200},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        width: 350,
        textAlign: 'left',
    },
    action: {
        position: 'absolute',
        top: 100,
    },
    resetPassword: {color: 'white'},
});

export default SettingShippingAddress;
