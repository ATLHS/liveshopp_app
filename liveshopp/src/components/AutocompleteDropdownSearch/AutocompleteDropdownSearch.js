import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';

import customer from '../../services/customer';

const AutocompleteDropdownSearch = ({ navigation }) => {
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      customer
        .getSellers()
        .then((res) => res)
        .then((data) => {
          const newSellerList = data.map((seller, index) => ({
            sellerId: seller._id,
            id: index + 1,
            title: seller.company_name,
            category: seller.business_activity,
            email: seller.email,
            imageUrl: seller.imageUrl,
            bio: seller.bio || '',
            instagram: seller.instagram || '',
            tiktok: seller.tiktok || '',
            websiteUrl: seller.websiteUrl || '',
          }));
          setDataList(newSellerList);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, []),
  );

  const setList = (value) => {
    if (!value) {
      setSuggestionsList([]);
      return;
    } else {
      setSuggestionsList(dataList);
    }
  };

  const gotToSellerProfilView = (selectedSeller) => {
    if (selectedSeller) {
      navigation.navigate('SellerProfilView', selectedSeller);
    }
    return;
  };

  return (
    <>
      <FontAwesomeIcon
        style={{
          position: 'absolute',
          left: 30,
          top: 70,
          zIndex: 1,
        }}
        icon={faSearch}
        size={15}
        color={'black'}
      />
      <AutocompleteDropdown
        ref={searchRef}
        showChevron={false}
        closeOnBlur={true}
        clearOnFocus={false}
        onSelectItem={(selectedSeller) => gotToSellerProfilView(selectedSeller)}
        onChangeText={(value) => setList(value)}
        EmptyResultComponent={<View />}
        dataSet={suggestionsList}
        onBlur={() => setSuggestionsList([])}
        direction={Platform.select({
          ios: 'down',
        })}
        suggestionsListContainerStyle={{}}
        suggestionsListMaxHeight={800}
        textInputProps={{
          placeholder: t('searchForSeller'),
          autoCorrect: false,
          autoCapitalize: 'none',

          placeholderTextColor: 'black',
          style: {
            color: 'black',
            fontSize: 14,
            paddingLeft: 35,
          },
        }}
        ClearIconComponent={<FontAwesomeIcon icon={faClose} color={'black'} />}
        inputContainerStyle={{
          backgroundColor: 'white',
          width: '90%',
          borderRadius: 10,
          borderColor: 'black',
          borderWidth: 1,
        }}
        containerStyle={{}}
        inputHeight={40}
      />
    </>
  );
};

export default AutocompleteDropdownSearch;
