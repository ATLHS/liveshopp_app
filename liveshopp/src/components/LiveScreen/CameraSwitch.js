import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const CameraSwitch = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress()}>
        <FontAwesomeIcon icon={faArrowsRotate} color={colors.LIGHT} size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    width: 50,
    backgroundColor: 'transparent',
    height: 50,
    top: 100,
    right: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default CameraSwitch;
