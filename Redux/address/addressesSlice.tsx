import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressesState {
  selectedAddress: string | null;
  selectedId: number | null;
}

const initialState: AddressesState = {
  selectedAddress: null,
  selectedId: null,
};
interface SelectedAddressPayload {
  id: number;
  address: string;
}

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<SelectedAddressPayload>) {
      state.selectedAddress = action.payload.address;
      state.selectedId = action.payload.id;
    },
  },
});

export const { setSelectedAddress } = addressesSlice.actions;
export default addressesSlice.reducer;
