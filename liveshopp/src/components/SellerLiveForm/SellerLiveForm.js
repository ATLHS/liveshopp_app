import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClock, faEuroSign} from '@fortawesome/free-solid-svg-icons';

const currentSellerLiveForm = [
    {
        name: 'product_name',
        label: 'Réf produit',
        type: 'textProduct',
        validation: {
            required: {
                value: true,
            },
        },
    },
    {
        name: 'product_price',
        type: 'textPrice',
        validation: {
            required: {
                value: true,
            },
        },
        label: 'Prix',
    },
    {
        name: 'product_auction_time',
        type: 'textTime',
        validation: {
            required: {
                value: true,
            },
        },
        label: 'Min',
    },
];

export const SellerLiveForm = ({navigation, onPress}) => {
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                {currentSellerLiveForm.map((textField, idx) => (
                    <Controller
                        key={idx}
                        control={control}
                        name={textField.name}
                        render={({field}) => (
                            <View style={{}}>
                                {textField.name !== 'product_name' ? (
                                    textField.name === 'product_price' ? (
                                        <FontAwesomeIcon
                                            style={{
                                                resizeMode: 'stretch',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                zIndex: 2,
                                                paddingRight: 110,
                                                marginTop: 18,
                                            }}
                                            icon={faEuroSign}
                                            color={colors.LIGHT}
                                            size={15}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            style={{
                                                resizeMode: 'stretch',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                zIndex: 2,
                                                paddingRight: 105,
                                                marginTop: 18,
                                            }}
                                            icon={faClock}
                                            color={colors.LIGHT}
                                            size={15}
                                        />
                                    )
                                ) : (
                                    ''
                                )}
                                <TextInput
                                    style={{
                                        width: textField.name === 'product_name' ? 180 : 60,
                                        borderWidth: 0,
                                        margin: 6,
                                        borderRadius: 5,
                                        height: 40,
                                        color: colors.LIGHT,
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    }}
                                    placeholder={textField.label}
                                    autoFocus={textField.autoFocus || false}
                                    onChangeText={value => field.onChange(value)}
                                    defaultValue={textField.defaultValue}
                                    placeholderTextColor="#CCCCCC"
                                    selectionColor={colors.LIGHT}
                                    editable={textField.editable}
                                    maxLength={
                                        textField.name === 'product_auction_time' ? 1 : 500
                                    }
                                    keyboardType={
                                        textField.name === 'product_name' ? 'default' : 'number-pad'
                                    }
                                />
                            </View>
                        )}
                        rules={textField.validation}
                    />
                ))}
            </View>
            <TouchableOpacity
                onPress={handleSubmit(data => onPress(data))}
                style={styles.startAuction}>
                {!isLoading ? (
                    <Text style={styles.title}>Lancer l’enchère</Text>
                ) : (
                    <ActivityIndicator size="small" color={colors.DARK}/>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 280,
        textAlign: 'center',
    },
    headlineMessage: {color: colors.LIGHT},
    fieldContainer: {margin: 10},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
    },
    action: {},
    resetPassword: {color: 'white'},
    containedStyles: {
        helperContainer: {width: 350},
        helperText: {color: colors.LIGHT},
    },
    outlinedStyles: {
        helperContainer: {width: 350},
        helperText: {color: colors.DARK},
    },
    title: {
        color: colors.LIGHT,
        textAlign: 'center',
        fontSize: 18,
    },
    startAuction: {
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: colors.DARK,
        borderRadius: 8,
        justifyContent: 'center',
        width: 324,
    },
});

export default SellerLiveForm;
