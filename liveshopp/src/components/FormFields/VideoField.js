import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import { faFileVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const TextArea = ({ field }) => {
  const { t } = useTranslation();
  const [videoUri, setVideoUri] = useState(null);

  const setAuctionVideoItem = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        durationLimit: 60,
        maxWidth: 1920,
        maxHeight: 1080,
        formatAsMp4: true,
      });

      handleImageLibraryResponse(result);
    } catch (error) {
      console.error('An error occurred while selecting a video:', error.message);
    }
  };

  const handleImageLibraryResponse = (result) => {
    const { didCancel, errorMessage, assets } = result;

    if (didCancel) {
      handleCancel();
    } else if (errorMessage) {
      handleError(errorMessage);
    } else if (!assets?.length) {
      return;
    } else if (assets[0].duration > 40) {
      handleSelectedVideoExceedDurationLimit();
    } else {
      handleSuccess(assets[0]);
    }
  };

  const handleCancel = () => {
    console.log('The user cancelled the process of selecting a video');
  };

  const handleError = (errorMessage) => {
    console.error('An error occurred while selecting a video:', errorMessage);
  };

  const handleSelectedVideoExceedDurationLimit = () => {
    Toast.show({
      type: 'toastError',
      text1: t('maxAuctionVideoDuration'),
    });
    console.error('The user exceeded the duration limit of the video');
  };

  const handleSuccess = (selectedVideo) => {
    field.onChange(selectedVideo);
    setVideoUri(selectedVideo);
  };

  return (
    <View>
      <TouchableOpacity onPress={setAuctionVideoItem} style={styles.container}>
        <>
          {videoUri && videoUri.uri ? (
            <Text style={styles.selectedFile}>{videoUri.fileName || t('selectVideoFile')}</Text>
          ) : (
            <View style={styles.placeholder}>
              <FontAwesomeIcon
                icon={faFileVideo}
                color={colors.LIGHT}
                size={40}
                style={styles.icon}
              />
              <Text style={styles.text}>{t('selectVideoFile')}</Text>
              <TouchableOpacity style={styles.button} onPress={setAuctionVideoItem}>
                <Text style={styles.buttonText}>{t('select')}</Text>
              </TouchableOpacity>
              <Text style={styles.tip}>👋 {t('auctionTips')}</Text>
            </View>
          )}
        </>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cecece',
    height: 600,
    marginBottom: 10,
    position: 'relative',
    borderRadius: 6,
  },
  selectedFile: {
    color: colors.DARK,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    padding: 20,
  },
  placeholder: {
    backgroundColor: 'black',
    alignItems: 'center',
    height: '100%',
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: colors.LIGHT,
    borderWidth: 2,
  },
  icon: {
    marginTop: 150,
  },
  text: {
    marginTop: 20,
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: colors.LIGHT,
  },
  button: {
    marginTop: 20,
    height: 40,
    backgroundColor: colors.LIGHT,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: colors.DARK,
    paddingRight: 20,
    paddingLeft: 20,
  },
  tip: {
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: colors.LIGHT,
    width: 250,
    textAlign: 'center',
  },
});

export default TextArea;
