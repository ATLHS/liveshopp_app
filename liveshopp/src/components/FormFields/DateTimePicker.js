import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { DateTime } from 'luxon';

import colors from '../../styles/colors';

const convertToParisDateTime = (date) => {
  return DateTime.fromJSDate(date, { zone: 'utc' }).setZone('Europe/Paris').startOf('minute');
};

const DateTimePicker = ({ inputField, field }) => {
  const [initialDate, setInitialDate] = useState(inputField.minimumDelay);

  useEffect(() => {
    const parisDateTime = convertToParisDateTime(initialDate);
    field.onChange(parisDateTime);
  }, []);

  const handleDateChange = (value) => {
    const parisDateTime = convertToParisDateTime(value);
    field.onChange(parisDateTime);
  };

  return (
    <>
      <DatePicker
        style={inputField.style}
        minimumDate={initialDate}
        locale={'fr'}
        date={initialDate}
        onDateChange={handleDateChange}
        theme={'auto'}
        minuteInterval={inputField.minuteInterval}
      />
      {inputField.helperMessage && (
        <View style={styles.condition}>
          <Text style={styles.conditionText}>{inputField.helperMessage}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  conditionText: { color: colors.DARK, fontSize: 14 },
  condition: { width: 350, marginTop: 10 },
});

export default DateTimePicker;
