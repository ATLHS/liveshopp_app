import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import {useForm} from 'react-hook-form';
import colors from '../../styles/colors';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import auth from '../../services/auth';
import {useDispatch} from 'react-redux';

const SellerSignupFormSchema = [
  {
    name: 'lastname',
    label: 'Nom',
    type: 'text',
    autoFocus: true,
    validation: {
      required: {
        value: true,
        message: 'Veuillez indiquer votre nom.',
      },
    },
  },
  {
    name: 'firstname',
    label: 'Prénom',
    type: 'text',
    validation: {
      required: {
        value: true,
        message: 'Veuillez indiquer votre prénom.',
      },
    },
  },
  {
    name: 'company_name',
    label: "Nom de l'entreprise",
    type: 'text',
    validation: {
      required: {
        value: true,
        message: "Veuillez indiquer le nom de l'entreprise.",
      },
    },
  },
  {
    name: 'business_activity',
    label: 'Secteur d’activité de l’entreprise',
    type: 'select',
    validation: {
      required: {
        value: true,
        message: "Veuillez sélectionner un secteur d'activité.",
      },
    },
    options: ['Sport', 'Mode', 'High-Tech', 'Antiquaire'],
  },
  {
    name: 'role',
    label: "Rôle dans l'entreprise",
    type: 'select',
    validation: {
      required: {
        value: true,
        message: "Veuillez sélectionner votre rôle dans l'entreprise.",
      },
    },
    options: ['Direction', 'Marketing', 'Commercial', 'R&D'],
  },
  {
    name: 'phone',
    label: 'Numéro de téléphone mobile',
    type: 'tel',
    validation: {
      required: {
        value: true,
        message: 'Veuillez indiquer un numéro de téléphone.',
      },
      pattern: {
        value: /^[0-9]+$/ && /^0[67]\d{8}$/,
        message: 'Veuillez indiquer un numéro valide.',
      },
    },
    options: ['Direction', 'Marketing', 'Commercial', 'R&D'],
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    validation: {
      required: {
        value: true,
        message: 'Veuillez indiquer votre adresse e-mail.',
      },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Veuillez indiquer une adresse e-mail valide.',
      },
    },
  },
  {
    name: 'password',
    label: 'Mot de passe',
    type: 'password',
    validation: {
      required: {
        value: true,
        message: 'Veuillez indiquer un mot de passe.',
      },
      pattern: {
        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        message: 'Veuillez indiquer un mot de passe valide.',
      },
    },
    helper:
      'Au moins 8 caractères, dont 1 majuscule, 1 minuscule et 1 chiffre et c’est tout..',
  },
];

export const SellerSignUp = ({navigation}) => {
  const {handleSubmit, control} = useForm();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSellerSignup = data => {
    setIsLoading(true);

    auth
      .handleSellerSignup(data)
      .then(res => res)
      .then(data => {
        setMessage(data.message);
        setIsLoading(false);
        navigation.navigate('EmailVerificationCode', {
          message: data.message,
          user_id: data.user.id,
        });
      })
      .catch(err => {
        setMessage(err.message);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView style={{marginBottom: 100}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.headlineContainer}>
                <Text style={styles.headline}>
                  Générez des revenues et fédérer votre communauté plus
                  simplement avec Liveshopp.
                </Text>
              </View>
              <View style={styles.headlineContainerMessage}>
                <Text style={styles.headlineMessage}>{message}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper
                  control={control}
                  schema={SellerSignupFormSchema}
                />
              </View>
              <View style={styles.condition}>
                <Text style={styles.conditionText}>
                  En créant votre compte vous acceptez les Conditions générales
                  d’utilisation, les Conditions générales de vente et la
                  politique de confidentialité de Liveshopp et confirmez avoir
                  plus de 16 ans.
                </Text>
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title="Let’s go !"
                  onPress={handleSubmit(handleSellerSignup)}
                  loading={isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headlineContainer: {marginBottom: 30},
  formContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  headlineContainerMessage: {
    marginBottom: 30,
    width: 350,
    textAlign: 'center',
  },
  headlineMessage: {color: colors.LIGHT},
  fieldContainer: {margin: 10},
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {},
  resetPassword: {color: 'white'},
  conditionText: {color: 'white'},
  condition: {width: 350, marginBottom: 30, marginTop: 30},
});

export default SellerSignUp;
