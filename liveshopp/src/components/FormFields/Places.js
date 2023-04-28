import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import {REACT_APP_GOOGLE_PLACES_API} from '@env';

const Places = ({inputField, field, fieldState}) => {
  const {user} = useSelector(state => state.user);
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(user.shipping_address || '');
  }, []);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Adresse de livraison"
      onPress={data => {
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
          marginTop: 30,
          width: 370,
          alignItems: 'center',
        },
        predefinedPlacesDescription: {
          fontSize: 20,
        },
        textInputContainer: {
          width: 350,
          fontSize: 15,
        },
        textInput: {
          height: 60,
          color: colors.DARK,
          backgroundColor: '#F4F4F4',
          opacity: 0.7,
          borderRadius: 10,
          fontSize: 20,
        },
        listView: {
          width: 350,
        },
        description: {
          fontSize: 16,
        },
        row: {
          marginBottom: 5,
          height: 50,
          width: 350,
        },
      }}
    />
  );
};

export default Places;
