import { configureStore } from "@reduxjs/toolkit";
import ActivationReducerSlice from "./slice/ActivationReducerSlice";
import UserInfoSlice from "./slice/UserInfoSlice";
import selectedAddressReducer from "../address/addressesSlice";

const store = configureStore({
  reducer: {
    auth: ActivationReducerSlice,
    users: UserInfoSlice,
    selectedAddress: selectedAddressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
