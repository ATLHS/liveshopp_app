import {createSlice} from '@reduxjs/toolkit';

export const livesSlice = createSlice({
  name: 'lives',
  initialState: {
    lives: [],
    sellerLives: [],
    isJoin: false,
    isGone: false,
    isHost: true,
    remoteUid: null,
    liveData: {
      channelName: '',
      sellerId: '',
      auctionId: '',
      auctionsStatus: '',
      userCount: '',
      messages: [],
      hostIsLive: false,
      currentAuction: {
        userId: '',
        username: '',
        productName: false,
        currentProductAmount: '',
        currentAuctionDelay: '',
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
      state.liveData.currentAuction.currentAuctionStatus = 'paused';
    },
    setIsHost: (state, action) => {
      state.isHost = action.payload;
    },
  },
});
export const {
  setLives,
  setIsGone,
  setIsJoin,
  setLiveData,
  setIsHost,
  setSellerLives,
  setRemoteUid,
  setCurrentAuction,
} = livesSlice.actions;
export default livesSlice.reducer;
