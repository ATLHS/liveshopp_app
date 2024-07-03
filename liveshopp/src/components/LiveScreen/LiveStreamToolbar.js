import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ActionPanel from './ActionPanel';
import CameraSwitch from './CameraSwitch';

const LiveStreamToolbar = ({ agoraEngineRef, liveData, actionPanelRef }) => {
  return (
    <View style={styles.container}>
      <CameraSwitch agoraEngineRef={agoraEngineRef} />
      <ActionPanel actionPanelRef={actionPanelRef} />
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

export default LiveStreamToolbar;
