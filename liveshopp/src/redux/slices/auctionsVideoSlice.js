import { createSlice } from '@reduxjs/toolkit';

export const auctionVideos = createSlice({
  name: 'auctionVideos',
  initialState: {
    sellerAuctionVideos: [],
    sellersAuctionVideos: [],
  },
  reducers: {
    setSellersAuctionVideos: (state, action) => {
      state.sellersAuctionVideos = action.payload;
    },
    setSellerAuctionVideos: (state, action) => {
      state.sellerAuctionVideos = action.payload;
    },
  },
});
export const { setSellersAuctionVideos, setSellerAuctionVideos } = auctionVideos.actions;
export default auctionVideos.reducer;
