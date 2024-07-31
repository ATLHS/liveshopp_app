import DefaultIsoCode from '../constants/DefaultIsoCode';

const validateFrPhoneNumber = (b) => {
  const [code, number] = b.phone.split(' ');
  const frCode = DefaultIsoCode;

  if (code === frCode) {
    const isValidFormat =
      /^[0-9]+$/.test(number) &&
      ((number.startsWith('0') && number.length === 10) ||
        ((number.startsWith('6') || number.startsWith('7')) && number.length === 9));

    return isValidFormat;
  }
  return true;
};

export default validateFrPhoneNumber;
