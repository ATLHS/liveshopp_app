import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

import colors from '../../styles/colors';

const liveMessage = {
  name: 'live_message',
  label: 'Message',
  type: 'text',
  validation: {
    required: {
      value: true,
    },
  },
};

export const LiveChatTextInput = ({ onPress }) => {
  const { handleSubmit, control, reset } = useForm();
  const ref = useRef();

  const clearMessageField = () => {
    ref.current?.clear();
  };

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Controller
          key={0}
          control={control}
          name={liveMessage.name}
          render={({ field }) => (
            <View style={styles.container}>
              <TextInput
                style={styles.textInput}
                ref={ref}
                clearButtonMode="always"
                returnKeyType="send"
                onSubmitEditing={handleSubmit((message) => {
                  onPress(message);
                  clearMessageField();
                  reset();
                })}
                placeholder={liveMessage.label}
                autoFocus={liveMessage.autoFocus || false}
                onChangeText={(value) => field.onChange(value)}
                defaultValue={liveMessage.defaultValue}
                placeholderTextColor="#CCCCCC"
                selectionColor={colors.LIGHT}
                editable={liveMessage.editable}
                maxLength={500}
                keyboardType={'default'}
              />
            </View>
          )}
          rules={liveMessage.validation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 5,
    height: 40,
    paddingLeft: 20,
    paddingRight: 40,
    color: colors.LIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    fontWeight: '600',
  },
});

export default LiveChatTextInput;
