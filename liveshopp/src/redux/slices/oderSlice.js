import {createSlice} from '@reduxjs/toolkit';

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    initialOrder: [],
  },
  reducers: {
    setInitialOrder: (state, action) => {
      state.initialOrder = action.payload;
    },
  },
});
export const {setInitialOrder} = orderSlice.actions;
export default orderSlice.reducer;
