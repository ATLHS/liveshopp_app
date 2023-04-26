import {configureStore} from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import livesSlices from './slices/livesSlice';
import orderSlice from './slices/oderSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    lives: livesSlices,
    order: orderSlice,
  },
});
