import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSelector } from 'react-redux';

import { REACT_APP_GOOGLE_PLACES_API } from '@env';

import colors from '../../styles/colors';

const Places = ({ inputField, field, fieldState }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(user.shipping_address || '');
  }, []);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={t('deliveryAddress')}
      onPress={(data) => {
        field.onChange(data.description);
      }}
      textInputProps={{
        returnKeyType: 'search',
      }}
      enablePoweredByContainer={false}
      query={{
        key: REACT_APP_GOOGLE_PLACES_API,
        language: 'fr',
      }}
      styles={{
        container: {
          position: 'absolute',
          top: 25,
          width: 370,
          alignItems: 'center',
          left: '50%',
          transform: [{ translateX: -185 }],
          backgroundColor: 'white',
        },
        predefinedPlacesDescription: {
          alignItems: 'center',
          fontSize: 15,
          backgroundColor: 'white',
        },
        textInputContainer: {
          width: 350,
          fontSize: 15,
          backgroundColor: 'white',
        },
        textInput: {
          height: 60,
          color: colors.DARK,
          backgroundColor: '#F4F4F4',
          opacity: 0.7,
          borderRadius: 10,
          fontSize: 15,
        },
        listView: {
          width: 350,
          backgroundColor: 'white',
        },
        description: {
          fontSize: 14,
          fontWeight: 500,
          backgroundColor: 'white',
        },
        row: {
          marginBottom: 5,
          height: 60,
          width: 350,
          alignItems: 'center',
          borderRadius: 5,
          backgroundColor: 'white',
        },
      }}
    />
  );
};

export default Places;
