import {StyleSheet, Text, View} from 'react-native';
import {Controller} from 'react-hook-form';
// FIXME
//
// Previously, we used `@hookform/error-message`
// Which required react = 16 incompatible with `react-native` 0.74
// Now it's temporarily disabled to remove the package.
// We should find a better solution.
//
// import {ErrorMessage} from '@hookform/error-message';
//
import FormConstructor from '../FormConstructor/FormConstructor';
// import MessageHelper from '../MessageHelper/MessageHelper';
import React from 'react';
import {useSelector} from 'react-redux';
import colors from '../../styles/colors';
import {Link} from '@react-navigation/native';

const FieldWrapper = ({control, schema}) => {
    const isAuthenticate = useSelector(state => state.user.isAuthenticate);
    return schema.map((field, idx) => (
        <View key={idx}>
            <Controller
                control={control}
                name={field.name}
                render={({...props}) => (
                    <>
                        <FormConstructor inputField={field} {...props} />
                        {/* <ErrorMessage
                            errors={props.formState.errors}
                            name={field.name}
                            render={({message}) => (
                                <MessageHelper message={message} />
                            )}
                        /> */}
                        {field.helper ? (
                            <View
                                style={
                                    isAuthenticate
                                        ? outlinedStyles.helperContainer
                                        : containedStyles.helperContainer
                                }>
                                <Text
                                    style={
                                        isAuthenticate
                                            ? outlinedStyles.helperText
                                            : containedStyles.helperText
                                    }>
                                    {field.helper.helperLink ? (
                                        <View>
                                            <Text style={{color: colors.LIGHT}}>
                                                {field.helper.helperMessage1}
                                            </Text>
                                            <Text style={{color: 'grey'}}>
                                                <Link
                                                    to={{screen: 'rgpdScreen'}}>
                                                    conditions générales
                                                    d’utilisation
                                                </Link>
                                            </Text>
                                            <Text style={{color: colors.LIGHT}}>
                                                {field.helper.helperMessage2}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{marginBottom: 20}}>
                                            <Text style={{color: colors.LIGHT}}>
                                                {field.helper}
                                            </Text>
                                        </View>
                                    )}
                                </Text>
                            </View>
                        ) : (
                            <Text />
                        )}
                    </>
                )}
                rules={field.validation}
            />
        </View>
    ));
};

const containedStyles = StyleSheet.create({
    helperContainer: {width: 350},
    helperText: {color: colors.LIGHT},
});

const outlinedStyles = StyleSheet.create({
    helperContainer: {width: 350},
    helperText: {color: colors.DARK},
});

export default FieldWrapper;
