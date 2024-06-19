import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Link } from '@react-navigation/native';

import colors from '../../styles/colors';
import FormConstructor from '../FormConstructor/FormConstructor';
import MessageHelper from '../MessageHelper/MessageHelper';

const FieldWrapper = ({ control, schema }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  const { t } = useTranslation();

  return schema.map((field, idx) => (
    <View key={idx}>
      <Controller
        control={control}
        name={field.name}
        render={({ ...props }) => (
          <>
            <FormConstructor inputField={field} {...props} />
            <MessageHelper {...props} />
            {field.helper ? (
              <View
                style={
                  isAuthenticate ? outlinedStyles.helperContainer : containedStyles.helperContainer
                }>
                <Text
                  style={isAuthenticate ? outlinedStyles.helperText : containedStyles.helperText}>
                  {field.helper.helperLink ? (
                    <View>
                      <Text style={{ color: colors.LIGHT }}>{field.helper.helperMessage1}</Text>
                      <Text style={{ color: 'grey' }}>
                        <Link to={{ screen: 'rgpdScreen' }}>{t('termsAndConditions')}</Link>
                      </Text>
                      <Text style={{ color: colors.LIGHT }}>{field.helper.helperMessage2}</Text>
                    </View>
                  ) : (
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ color: colors.LIGHT }}>{field.helper}</Text>
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
  helperContainer: { width: 350 },
  helperText: { color: colors.LIGHT },
});

const outlinedStyles = StyleSheet.create({
  helperContainer: { width: 350 },
  helperText: { color: colors.DARK },
});

export default FieldWrapper;
