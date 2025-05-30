import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import Wave from "@/assets/styles/components/Wave";
import NotificationsIcon from "../../assets/svg/Notification";
import BimarLogo from "../../assets/svg/bimarLogo";

const Header = () => {
  const dispatch = useDispatch();
  const [tokenState, setTokenState] = useState(null);

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setTokenState(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setTokenState(null);
    }
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (tokenState) {
        dispatch(fetchUserInfo());
      }
    };
    loadUserInfo();
  }, [dispatch, tokenState]);

  const data = useSelector((state) => state?.users);
  const user = data?.user;
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const getItems = async () => {
      try {
        const storedBasket = await AsyncStorage.getItem("cartsBasket");
        const parsedBasket = storedBasket ? JSON.parse(storedBasket) : [];
        setTotalQuantity(parsedBasket.length);
      } catch (error) {
        console.error("Ошибка при получении товаров из корзины:", error);
      }
    };
    getItems();
  }, []);

  return (
    <View
      style={[
        styles.header,
        stylesAll.header_nav,
        stylesAll.container,
        { paddingBottom: 18 },
      ]}
    >
      {/* <TextContent fontSize={16} fontWeight={600} color={colors.black}>
        Добро пожаловать, {
          !tokenState ? (
            <TextContent>гость</TextContent>
          ) : (
            user?.first_name
          )
        } 
      </TextContent> */}
      <BimarLogo />
      <Wave
        handle={() => router.push("navigate/Notifications")}
        style={{ position: "relative" }}
      >
        <NotificationsIcon />
        {/* {totalQuantity > 0 && (
          <View style={styles.border_basket_not}>
            <Text style={styles.border_basket_text}>{totalQuantity}</Text>
          </View>
        )} */}
      </Wave>
    </View>
  );
};
const styles = StyleSheet.create({
  header_gray: {
    backgroundColor: colors.phon,
  },
  border_basket_not: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: colors.feuillet,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: -4,
    right: -8,
  },
  border_basket_text: {
    fontSize: 11,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 42,
  },
});

export default Header;
