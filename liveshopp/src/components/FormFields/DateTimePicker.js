import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {DateTime} from 'luxon';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/colors';

const DateTimePicker = ({field}) => {
  const [initialDate, setInitialDate] = useState(
    DateTime.now().plus({minutes: 30}).toJSDate(),
  );

  let date = field.value
    ? DateTime.fromJSDate(field.value).toLocal().toJSDate()
    : initialDate;

  useEffect(() => {
    const timer = setTimeout(
      () => setInitialDate(DateTime.now().plus({minutes: 30}).toJSDate()),
      5000,
    );
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <>
      <DatePicker
        style={{height: 150}}
        minimumDate={initialDate}
        locale={'fr'}
        date={date}
        onDateChange={value => field.onChange(value)}
      />
      <View style={styles.condition}>
        <Text style={styles.conditionText}>
          Un intervalle de 1h30 entre le début et la fin de chaque live est
          requis.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  conditionText: {color: colors.DARK, fontSize: 13,
    fontWeight: '600'},
  condition: {width: 350, marginTop: 10},
});

export default DateTimePicker;
