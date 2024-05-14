import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import {Slider} from '@miblanchard/react-native-slider';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons';

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

export const UserLiveForm = ({navigation, onPress, liveData}) => {
  const {user} = useSelector(state => state.user);
  const {handleSubmit, control, setValue} = useForm();
  const [bidAmountSelection, setBidAmountSelection] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue('bid', 10)
  }, [])

  const disableUserForm =
    liveData.currentAuction.currentAuctionStatus === 'stopping' ||
    liveData.currentAuction.currentAuctionStatus === 'paused' ||
    !user.hasValidPaymentMethod ||
    !user.shipping_address;

  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
      {user.hasValidPaymentMethod && user.shipping_address ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View>
            {currentUserLiveForm.map((field, idx) => (
              <Controller
                key={idx}
                control={control}
                name={field.name}
                render={({field}) => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      trackStyle={{height: 2}}
                      containerStyle={{width: 265}}
                      renderThumbComponent={() => (
                          <View
                              style={{
                                backgroundColor: colors.DARK,
                                height: 35,
                                width: 35,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5
                              }}>
                            <FontAwesomeIcon
                                icon={faAnglesRight}
                                size={17}
                                color={'white'}
                            />
                          </View>
                      )}
                      maximumTrackTintColor={colors.DARK}
                      minimumTrackTintColor={colors.DARK}
                      minimumValue={10}
                      maximumValue={50}
                      onValueChange={value => {
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
      ) : (
        ''
      )}
      <TouchableOpacity
        disabled={disableUserForm}
        onPress={handleSubmit(data => onPress(data))}
        style={[styles.startAuction, {opacity: disableUserForm ? 0.5 : 1}]}>
        {!isLoading ? (
          <Text style={styles.title}>Enchérir</Text>
        ) : (
          <ActivityIndicator size="small" color={colors.DARK} />
        )}
      </TouchableOpacity>
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

export default UserLiveForm;
