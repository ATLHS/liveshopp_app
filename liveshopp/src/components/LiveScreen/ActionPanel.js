import { StyleSheet, TouchableOpacity } from 'react-native';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const ActionPanel = ({ actionPanelRef }) => {
  const toggleActionPanel = () => {
    actionPanelRef.current?.togglePanel();
  };
  return (
    <TouchableOpacity style={styles.actionPanelContainer} onPress={() => toggleActionPanel()}>
      <FontAwesomeIcon icon={faEllipsisV} color={colors.LIGHT} size={25} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionPanelContainer: {
    marginBottom: 15,
  },
});

export default ActionPanel;
