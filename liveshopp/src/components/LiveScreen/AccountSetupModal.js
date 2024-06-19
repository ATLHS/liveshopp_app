import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../../styles/colors';

const AccountSetupModal = ({ visible, onPress }) => {
  const { t } = useTranslation();

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Pressable onPress={() => onPress()} style={styles.screen}>
        <View style={styles.modal}>
          <Text style={styles.message}>{t('welcomeToTheGame')}</Text>
          <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.accept}>{t('iUnderstand')}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  accept: {
    color: colors.LIGHT,
    textAlign: 'center',
    fontSize: 15,
  },
  button: {
    height: 40,
    width: 150,
    backgroundColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    marginBottom: 20,
  },
  modal: {
    height: 230,
    width: 290,
    borderRadius: 5,
    backgroundColor: colors.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
});

export default AccountSetupModal;
