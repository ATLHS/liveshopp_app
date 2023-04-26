import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticate: false,
    user: {profil: null},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticate: (state, action) => {
      state.isAuthenticate = action.payload;
    },
  },
});
export const {setUser, setIsAuthenticate} = userSlice.actions;
export const selectIsAuthenticate = state => state.isAuthenticate;
export default userSlice.reducer;
