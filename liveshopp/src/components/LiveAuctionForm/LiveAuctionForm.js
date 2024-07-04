import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Slider } from '@miblanchard/react-native-slider';

import colors from '../../styles/colors';

const currentUserLiveForm = [
  {
    name: 'bid',
    label: 'enchère',
    type: 'slider',
    value: 10,
    validation: {
      required: {
        value: true,
      },
    },
  },
];

export const LiveAuctionForm = ({ onPress, currentAuction }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const { handleSubmit, control, setValue } = useForm();
  const [bidAmountSelection, setBidAmountSelection] = useState(10);

  useEffect(() => {
    setValue('bid', 10);
  }, []);

  const disableUserForm =
    currentAuction.currentAuctionStatus === 'stopping' ||
    currentAuction.currentAuctionStatus === 'paused' ||
    !user.hasValidPaymentMethod ||
    !user.shipping_address;

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', width: '95%' }}>
      {user.hasValidPaymentMethod && user.shipping_address && (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
          }}>
          <View style={{ width: '100%' }}>
            {currentUserLiveForm.map((field, idx) => (
              <Controller
                key={idx}
                control={control}
                name={field.name}
                render={({ field }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        width: 50,
                        height: 35,
                        backgroundColor: 'black',
                        borderRadius: 5,
                        opacity: 0.7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: colors.LIGHT,
                          fontSize: 17,
                          fontFamily: 'FugazOne-Regular',
                        }}>
                        {bidAmountSelection} €
                      </Text>
                    </View>
                    <Slider
                      value={field.value || bidAmountSelection}
                      step={10}
                      trackStyle={{ height: 2, width: '100%' }}
                      containerStyle={styles.container}
                      renderThumbComponent={() => (
                        <View
                          style={{
                            backgroundColor: colors.DARK,
                            height: 35,
                            width: 35,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                          }}>
                          <FontAwesomeIcon icon={faAnglesRight} size={17} color={colors.LIGHT} />
                        </View>
                      )}
                      maximumTrackTintColor={colors.DARK}
                      minimumTrackTintColor={colors.DARK}
                      minimumValue={10}
                      maximumValue={50}
                      onValueChange={(value) => {
                        setBidAmountSelection(value);
                        field.onChange(value[0]);
                      }}
                    />
                  </View>
                )}
                rules={field.validation}
              />
            ))}
          </View>
        </View>
      )}
      <TouchableOpacity
        disabled={disableUserForm}
        onPress={handleSubmit((data) => onPress(data))}
        style={[styles.startAuction, { opacity: disableUserForm ? 0.5 : 1 }]}>
        <Text style={styles.title}>{t('bid')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%',
  },
});

export default LiveAuctionForm;
