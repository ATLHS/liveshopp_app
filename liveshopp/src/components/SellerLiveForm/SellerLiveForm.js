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

const currentSellerLiveForm = [
    {
        name: 'product_name',
        label: 'Article',
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
                message: "message d'erreur2"
            },
        },
        label: 'Prix de départ',
    },
    {
        name: 'product_reserved_price',
        type: 'textPrice',
        validation: {
            required: {
                value: false,
                message: "message d'erreur 3"
            },
            validate: (_, b) => {
                if (b.product_reserved_price){
                    return Number(b.product_price) < Number(b.product_reserved_price);
                }
                return true;
            }
        },
        label: ' Prix de réserve',
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

export const SellerLiveForm = ({onPress}) => {
    const {handleSubmit, control} = useForm();
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={{flex: 1}}>
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
                        render={({field, _, formState}) => (
                                <View style={{}}>
                                    {textField.name === 'product_reserved_price' &&  <Text style={{fontSize: 9, fontWeight: '500', marginBottom: 0, position: 'absolute', bottom: 50, left: 10, color: colors.LIGHT, fontStyle: 'italic' }}>Optionnel</Text>}
                                    <TextInput
                                        style={{
                                            width:
                                                textField.name === 'product_name'
                                                    ? 85
                                                    : textField.name ===
                                                    'product_reserved_price'
                                                        ? 100
                                                        : textField.name ===
                                                        'product_auction_time'
                                                            ? 35
                                                            : 90,
                                            borderWidth: 0,
                                            margin: 6,
                                            borderRadius: 5,
                                            borderBottomLeftRadius:
                                                textField.name ===
                                                'product_reserved_price'
                                                    ? 0
                                                    : 5,
                                            borderTopLeftRadius:
                                                textField.name ===
                                                'product_reserved_price'
                                                    ? 0
                                                    : 5,
                                            borderBottomRightRadius:
                                                textField.name === 'product_price'
                                                    ? 0
                                                    : 5,
                                            borderTopRightRadius:
                                                textField.name === 'product_price'
                                                    ? 0
                                                    : 5,
                                            marginRight:
                                                textField.name === 'product_price'
                                                    ? 0
                                                    : 5,
                                            marginLeft:
                                                textField.name ===
                                                'product_reserved_price'
                                                    ? 0
                                                    : 5,
                                            height: 40,
                                            color: colors.LIGHT,
                                            padding: 5,
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            fontSize: 11,
                                            fontWeight: '600',
                                        }}
                                        placeholder={textField.label}
                                        autoFocus={textField.autoFocus || false}
                                        onChangeText={value => {field.onChange(value)}}
                                        defaultValue={textField.defaultValue}
                                        placeholderTextColor="#CCCCCC"
                                        selectionColor={colors.LIGHT}
                                        editable={textField.editable}
                                        maxLength={
                                            textField.name ===
                                            'product_auction_time'
                                                ? 1
                                                : 500
                                        }
                                        keyboardType={
                                            textField.name === 'product_name'
                                                ? 'default'
                                                : 'number-pad'
                                        }
                                    />
                                    {textField.name === 'product_reserved_price' && <Text style={{position: 'absolute', color: '#CCCCCC', left: -2, top: 14, fontWeight: '500', fontSize: 18}}>/</Text>}
                                </View>
                        )}
                        rules={textField.validation}
                    />
                ))}
            </View>
            <TouchableOpacity
                onPress={handleSubmit(data => {
                    onPress(data);
                    setDisabled(true);
                })}
                style={styles.startAuction}
                disabled={disabled}>
                {!disabled ? (
                    <Text style={styles.title}>
                        Démarrer l'enchère !
                    </Text>
                ) : (
                    <ActivityIndicator size="small" color={colors.LIGHT} />
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
        margin: 6,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: colors.DARK,
        borderRadius: 5,
        justifyContent: 'center',
        width: 330,
    },
});

export default SellerLiveForm;
