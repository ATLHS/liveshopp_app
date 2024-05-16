import React, {useState} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import colors from '../../styles/colors';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';

const TextType = ({inputField, field, fieldState}) => {
    const [value, setValue] = useState('');
    return (
        <CodeField
            rootStyle={{width: 350, marginBottom: 15}}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={code => {
                field.onChange(code);
                setValue(code);
            }}
            cellCount={4}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
                <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
            )}
        />
    );
};

const styles = StyleSheet.create({
    cell: {
        width: 60,
        height: 60,
        fontSize: 24,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: 'white',
        textAlign: 'center',
        lineHeight: 55,
        margin: 5,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    focusCell: {
        borderColor: colors.PRIMARY,
    },
});

export default TextType;
