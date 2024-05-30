import { REACT_APP_BASE_URL, REACT_APP_LOCAL_URL } from '@env';

const URL = __DEV__ ? REACT_APP_LOCAL_URL : REACT_APP_BASE_URL;

export default {
  URL,
};
