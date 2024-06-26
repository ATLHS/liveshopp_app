const validateFrPhoneNumber = (b) => {
  const isFrDialCcode = b.phone.split(' ')[0] === '+33';
  if (isFrDialCcode) {
    const isValidFormat =
      /^[0-9]+$/.test(b.phone.split(' ')[1]) && /^0[67]\d{8}$/.test(b.phone.split(' ')[1]);
    return isValidFormat;
  }
  return true;
};

export default validateFrPhoneNumber;
