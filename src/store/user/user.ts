import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialStateInterface {
  user: User;
}

const initialState: initialStateInterface = {
  user: {
    id: null,
    email: '',
    first_name: '',
    last_name: ''
  }
};

export const userSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  }
});

export const { setUser } = userSlicer.actions;

export default userSlicer.reducer;
