import { configureStore } from '@reduxjs/toolkit';

import auctionVideos from './slices/auctionsVideoSlice';
import livesSlices from './slices/livesSlice';
import orderSlice from './slices/oderSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    lives: livesSlices,
    order: orderSlice,
    auctionVideos: auctionVideos,
  },
});
