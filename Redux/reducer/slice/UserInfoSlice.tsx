import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

interface UserInfo {
  phone: string;
  first_name: string;
  last_name: string;
  bonus_id: string;
  bonus: number;
  qrimg: string;
  birthday: string | null;
  gender: string | null;
  language: string | null;
  married: string | null;
  status: string | null;
  city: string | null;
  children: boolean;
  animal: boolean;
  car: boolean;
  email: string | null;
  notification: boolean;
  auto_brightness: boolean;
  contactName:string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { authUser, setLoading, setError } = userInfoSlice.actions;
export default userInfoSlice.reducer;
