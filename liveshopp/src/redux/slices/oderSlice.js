import { createSlice } from '@reduxjs/toolkit';

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    initialOrder: [],
  },
  reducers: {
    setInitialOrder: (state, action) => {
      state.initialOrder = action.payload;
    },
    updateInitialOrder: (state, action) => {
      state.initialOrder = state.initialOrder.map((order) =>
        order._id === action.payload._id ? action.payload : order,
      );
    },
  },
});
export const { setInitialOrder, updateInitialOrder } = orderSlice.actions;
export default orderSlice.reducer;
