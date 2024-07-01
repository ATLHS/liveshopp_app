import { StyleSheet, TouchableOpacity } from 'react-native';

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const CameraSwitch = ({ agoraEngineRef }) => {
  const switchCamera = () => {
    agoraEngineRef.current?.switchCamera();
  };
  return (
    <TouchableOpacity style={styles.cameraSwitchContainer} onPress={() => switchCamera()}>
      <FontAwesomeIcon icon={faArrowsRotate} color={colors.LIGHT} size={25} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cameraSwitchContainer: {
    marginBottom: 15,
  },
});

export default CameraSwitch;
