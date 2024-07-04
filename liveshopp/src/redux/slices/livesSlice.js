import { createSlice } from '@reduxjs/toolkit';

export const livesSlice = createSlice({
  name: 'lives',
  initialState: {
    lives: [],
    sellerLives: [],
    isJoin: false,
    isGone: false,
    remoteUid: null,
    liveData: {
      channelName: '',
      sellerId: '',
      auctionId: '',
      auctionsStatus: '',
      liveSchedule: null,
      userCount: '',
      messages: [],
      hostIsLive: false,
      currentAuction: {
        userId: '',
        username: '',
        productName: false,
        currentProductAmount: '',
        currentAuctionTimer: '',
        currentAuctionStatus: 'paused',
        salePrice: '',
      },
    },
  },
  reducers: {
    setLives: (state, action) => {
      state.lives = action.payload;
    },
    setRemoteUid: (state, action) => {
      state.remoteUid = action.payload;
    },
    setSellerLives: (state, action) => {
      state.sellerLives = action.payload;
    },
    setIsJoin: (state, action) => {
      state.isJoin = action.payload;
    },
    setIsGone: (state, action) => {
      state.isGone = action.payload;
    },
    setLiveData: (state, action) => {
      state.liveData = action.payload;
    },
    setCurrentAuction: (state, action) => {
      state.liveData.currentAuction = action.payload;
    },
    setNewChatMessage: (state, action) => {
      state.liveData.messages.push(action.payload);
    },
  },
});
export const {
  setCurrentAuction,
  setLives,
  setIsGone,
  setIsJoin,
  setLiveData,
  setNewChatMessage,
  setSellerLives,
  setRemoteUid,
} = livesSlice.actions;
export default livesSlice.reducer;
