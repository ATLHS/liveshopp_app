import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../../styles/colors';

export const SellerLiveForm = ({ onPress }) => {
  const { t } = useTranslation();
  const currentSellerLiveForm = [
    {
      name: 'product_name',
      label: t('Product'),
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
          message: "message d'erreur2",
        },
      },
      label: t('startingPrice'),
    },
    {
      name: 'product_reserved_price',
      type: 'textPrice',
      validation: {
        required: {
          value: false,
          message: "message d'erreur 3",
        },
        validate: (_, b) => {
          if (b.product_reserved_price) {
            return Number(b.product_price) < Number(b.product_reserved_price);
          }
          return true;
        },
      },
      label: t('reservePrice'),
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

  const { handleSubmit, control } = useForm();
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.sellerLiveFormContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '95%',
        }}>
        {currentSellerLiveForm.map((textField, idx) => (
          <Controller
            key={idx}
            control={control}
            name={textField.name}
            render={({ field, _, formState }) => (
              <>
                {textField.name === 'product_reserved_price' && (
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: '500',
                      marginBottom: 0,
                      position: 'absolute',
                      bottom: 45,
                      left: '57.5%',
                      color: colors.LIGHT,
                      fontStyle: 'italic',
                    }}>
                    {t('optional')}
                  </Text>
                )}
                <TextInput
                  style={{
                    width:
                      textField.name === 'product_name'
                        ? '25%'
                        : textField.name === 'product_reserved_price'
                        ? '28%'
                        : textField.name === 'product_auction_time'
                        ? '10%'
                        : '28%',
                    borderWidth: 0,
                    borderRadius: 5,
                    borderBottomLeftRadius: textField.name === 'product_reserved_price' ? 0 : 5,
                    borderTopLeftRadius: textField.name === 'product_reserved_price' ? 0 : 5,
                    borderBottomRightRadius: textField.name === 'product_price' ? 0 : 5,
                    borderTopRightRadius: textField.name === 'product_price' ? 0 : 5,
                    marginRight: textField.name === 'product_price' ? 0 : '2.3%',
                    marginLeft: textField.name === 'product_reserved_price' ? 0 : '2.2%',
                    height: 40,
                    color: colors.LIGHT,
                    padding: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                  placeholder={textField.label}
                  autoFocus={textField.autoFocus || false}
                  onChangeText={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={textField.defaultValue}
                  placeholderTextColor="#CCCCCC"
                  selectionColor={colors.LIGHT}
                  editable={textField.editable}
                  maxLength={textField.name === 'product_auction_time' ? 1 : 500}
                  keyboardType={textField.name === 'product_name' ? 'default' : 'number-pad'}
                />
              </>
            )}
            rules={textField.validation}
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={handleSubmit((data) => {
          onPress(data);
          setDisabled(true);
        })}
        style={styles.startAuction}
        disabled={disabled}>
        {!disabled ? (
          <Text style={styles.title}>{t('startAuction')}</Text>
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
  sellerLiveFormContainer: { width: '100%', alignItems: 'center', marginTop: '2%' },
  headlineContainer: { marginBottom: 30 },
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
  headlineMessage: { color: colors.LIGHT },
  fieldContainer: { margin: 10 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
  },
  action: {},
  resetPassword: { color: 'white' },
  containedStyles: {
    helperContainer: { width: 350 },
    helperText: { color: colors.LIGHT },
  },
  outlinedStyles: {
    helperContainer: { width: 350 },
    helperText: { color: colors.DARK },
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
    borderRadius: 5,
    justifyContent: 'center',
    width: '95%',
  },
});

export default SellerLiveForm;
