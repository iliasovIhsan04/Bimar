import { stylesAll } from "@/style";
import { AppDispatch, RootState } from "@/Redux/reducer/store";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "./HeaderAll";
import { colors } from "@/assets/styles/components/colors";

const QrCode = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null)

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setToken(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setToken(null);
    }
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (token) {
        dispatch(fetchUserInfo());
      }
    };
    loadUserInfo();
  }, [dispatch, token]);

  const data = useSelector((state) => state.users);
  const user = data?.user;
  return (
    <View>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
          ></TouchableOpacity>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={[
                stylesAll.header_name,
                { textAlign: "center", flexDirection: "column" },
              ]}
            >
              Ваша карта «Бай Элим»
            </Text>
            <Text style={styles.qr_code_id}>{user?.bonus_id}</Text>
          </View>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View style={styles.qr_code_box}>
          <Image style={styles.gr_code_img} source={{ uri: user?.qrimg }} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  qr_code_id: {
    fontSize: 16,
    fontWeight: "400",
    color:colors.feuillet,
    textAlign: "center",
  },
  qr_code_box: {
    height: 350,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    marginTop: 20,
    borderRadius:10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gr_code_img: {
    width: "100%",
    height: "100%",
    borderRadius:10,
  },
});

export default QrCode;
