import { DateTime } from 'luxon';

import LiveStatus from '../constants/LiveStatus';
import UserType from '../constants/UserType';
import { setLives, setSellerLives } from '../redux/slices/livesSlice';

export const checkAndUpdateLiveStatus = (lives, dispatch, userType) => {
  const updatedLives = lives.map((live) => {
    const specifiedTime = DateTime.fromISO(live.live_date_time);
    const currentTime = DateTime.now();
    const differenceInMinutes = specifiedTime.diff(currentTime, 'minutes').minutes;

    // Display lives defined as started (less 5 minutes)
    if (live.live_status === LiveStatus.UPCOMING && differenceInMinutes <= 5) {
      return { ...live, live_status: LiveStatus.LIVE };
    }

    return live;
  });

  // Dispatch updated lives based on user type
  userType === UserType.USER
    ? dispatch(setLives(updatedLives))
    : dispatch(setSellerLives(updatedLives));
};
