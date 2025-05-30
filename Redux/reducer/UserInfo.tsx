import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "@/Api";
import { authUser, setLoading } from "./slice/UserInfoSlice";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";

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
}

export const fetchUserInfo = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const token = await AsyncStorage.getItem("tokenActivation");
    if (token) {
      const response = await axios.get<UserInfo>(`${url}/user/user-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(authUser(response.data));
    }
  } catch (error) {
    console.error("Не удалось получить информацию о пользователе", error);
  } finally {
    dispatch(setLoading(false));
  }
};
