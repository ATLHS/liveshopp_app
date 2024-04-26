import React, {useRef} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import colors from '../../styles/colors';
const liveMessage = [
    {
        name: 'live_message',
        label: 'Message',
        type: 'text',
        validation: {
            required: {
                value: true,
            },
        },
    },
];

export const LiveChatTextInput = ({onPress, live, isHost}) => {
    const {handleSubmit, control, reset} = useForm();
    const ref = useRef();

    const clearMessageField = () => {
        ref.current?.clear();
    };

    return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            {!isHost ? (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    {liveMessage.map((textField, idx) => (
                        <Controller
                            key={idx}
                            control={control}
                            name={textField.name}
                            render={({field}) => (
                                <View style={{width: 323}}>
                                    <TextInput
                                        style={{
                                            borderWidth: 0,
                                            borderRadius: 5,
                                            height: 40,
                                            paddingRight: 40,
                                            paddingLeft: 10,
                                            color: colors.LIGHT,
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.4)',
                                            fontWeight: '600',
                                        }}
                                        ref={ref}
                                        clearButtonMode="always"
                                        returnKeyType="send"
                                        onSubmitEditing={handleSubmit(data => {
                                            onPress(data, live);
                                            clearMessageField();
                                            reset();
                                        })}
                                        placeholder={textField.label}
                                        autoFocus={textField.autoFocus || false}
                                        onChangeText={value =>
                                            field.onChange(value)
                                        }
                                        defaultValue={textField.defaultValue}
                                        placeholderTextColor="#CCCCCC"
                                        selectionColor={colors.LIGHT}
                                        editable={textField.editable}
                                        maxLength={500}
                                        keyboardType={'default'}
                                    />
                                </View>
                            )}
                            rules={textField.validation}
                        />
                    ))}
                </View>
            ) : (
                <View />
            )}
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

export default LiveChatTextInput;
