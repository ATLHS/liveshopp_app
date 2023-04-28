import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export const EmailVerificationCode = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EmailVerificationCode;
