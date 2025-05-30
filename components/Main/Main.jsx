import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  RefreshControl,
  Dimensions,
} from "react-native";
import BonusCart from "./BonusCart";
import Header from "./Header";
import Promotion from "./Promotion";
import { stylesAll } from "@/style";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import StoryComponent from "./StorisBlock";
import { router, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import Column from "../../assets/styles/components/Column";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import { url } from "@/Api";
import axios from "axios";
import Button from "@/assets/customs/Button";
import CartImg from "../../assets/svg/cartimg";
import { OneSignal } from "react-native-onesignal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SalesHits from "./SalesHits";

const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

export default function Main() {
  const [onesignalPush, setOneSignalPush] = useState("");
  const dispatch = useDispatch();
  const [modalRegistration, setModalRegistration] = useState(false);
  const scaleValueModal2 = useRef(new Animated.Value(0)).current;
  const opacityValueModal2 = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [local, setLocal] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [isTokenSent, setIsTokenSent] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { showModal, pushModal } = route.params || {};

  useEffect(() => {
    if (showModal) {
      setModalRegistration(true);
    }
  }, [showModal]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchUserInfo());
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const data = useSelector((state) => state.users);
  const user = data?.user;

  useEffect(() => {
    if (modalRegistration) {
      Animated.parallel([
        Animated.spring(scaleValueModal2, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValueModal2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValueModal2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValueModal2, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalRegistration]);

  useEffect(() => {
    const getPushToken = async () => {
      try {
        const token = await AsyncStorage.getItem("oneSignalPushToken");
        if (token) {
          setPushToken(token);
        } else {
          console.log("Push token not found.");
        }
      } catch (error) {
        console.error("Error retrieving push token:", error);
      }
    };

    getPushToken();
  }, []);

  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        if (!pushToken) {
          OneSignal.initialize("fe583f20-e625-4a57-a189-86064508d256");
          OneSignal.Notifications.requestPermission(true);
          let externalId = String(user?.id);
          if (externalId) {
            OneSignal.login(externalId);
          }
          OneSignal.User.pushSubscription.optIn();
          OneSignal.User.pushSubscription.addEventListener(
            "change",
            async (subscription) => {
              const userId = String(subscription?.current?.id);
              if (userId) {
                await AsyncStorage.setItem("oneSignalPushToken", userId);
                setPushToken(userId);
              }
            }
          );
        } else {
        }
      } catch (error) {
        console.error("Ошибка инициализации OneSignal:", error);
      }
    };
    const handleNotificationClick = (event) => {
      console.log("Push уведомление нажато:", event);

      const screen = event?.notification?.additionalData?.screen;
      if (screen) {
        console.log("Навигация:", screen);
        router.push(screen);
      } else {
        navigation.navigate("navigate/Notifications");
      }
    };

    initializeOneSignal();
    OneSignal.Notifications.addEventListener("click", handleNotificationClick);
    return () => {
      OneSignal.Notifications.removeEventListener(
        "click",
        handleNotificationClick
      );
    };
  }, [user]);

  useEffect(() => {
    AsyncStorage.getItem("tokenActivation").then((token) => setLocal(token));
  }, []);

  const sendTokenToServer = async () => {
    try {
      if (!pushToken) {
        console.error("Ошибка: Push токен алынган жок!");
        return;
      }
      if (!local) {
        console.error("Ошибка: Авторизациялык токен жок!");
        return;
      }

      console.log("Отправка токена на сервер:", pushToken);
      const response = await axios.post(
        `${url}/main/device-token/`,
        {
          device_token: pushToken,
        },
        {
          headers: { Authorization: `Bearer ${local}` },
        }
      );
    } catch (error) {
      console.error(
        "Ошибка при отправке токена на сервер:",
        error.response?.data || error
      );
    }
  };

  useEffect(() => {
    if (!isTokenSent && pushModal && pushToken && local) {
      sendTokenToServer();
      setIsTokenSent(true);
    }
  }, [pushModal, pushToken, local, isTokenSent]);
  return (
    <>
      <Modal
        visible={modalRegistration}
        transparent={true}
        animationType="none"
      >
        <Pressable
          style={stylesAll.content_modal}
          onPress={() => setModalRegistration(false)}
        >
          <Animated.View
            style={[
              stylesAll.modal_block_placing,
              {
                transform: [{ scale: scaleValueModal2 }],
                opacity: opacityValueModal2,
              },
            ]}
          >
            <Ionicons
              onPress={() => setModalRegistration(false)}
              size={24}
              style={stylesAll.icon_close}
              name="close"
            />
            <View style={styles.modal_block_img}>
              <CartImg />
            </View>
            <Text style={styles.modal_text_title}>
              Ваша карта успешно создана!
            </Text>
            <Text style={styles.modal_text}>
              Теперь вы можете экономить на покупках, получать скидки, подарки и
              многое другое
            </Text>
            <View style={{ width: "100%" }}>
              <Button
                color={colors.feuillet}
                handle={() => setModalRegistration(false)}
              >
                Понятно
              </Button>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
      <Header />
      <ScrollView
        style={stylesAll.background_block}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={["#008C44"]}
            tintColor={"#008C44"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <Column top={10} bottom={20} gap={4} style={[stylesAll.container]}>
            <TextContent fontSize={16} fontWeight={600} color={colors.black}>
              Привет,{" "}
              {!local ? <TextContent>гость</TextContent> : user?.first_name}
            </TextContent>
            <TextContent fontSize={18} fontWeight={700}>
              Все нужные товары - под рукой!
            </TextContent>
          </Column>
          <StoryComponent />
          <Column gap={10} style={{ marginBottom: 50 }}>
            <View style={stylesAll.container}>
              <Column gap={10}>
                <BonusCart />
                {/* <View style={styles.apple_check_price}>
                  <Wave
                    style={styles.apple_box}
                    handle={() => router.push("navigate/FeaturedProducts")}
                  >
                    <Flex gap={10} style={{ justifyContent: "center" }}>
                      <Favorite />
                      <TextContent
                        fontSize={16}
                        fontWeight={700}
                        color={colors.black}
                        style={{ textAlign: "center", width: 100 }}
                      >
                        Избранные товары
                      </TextContent>
                    </Flex>
                  </Wave>
                  <Wave
                    style={styles.apple_box}
                    handle={() => router.push("/navigate/BasketPage")}
                  >
                    <Flex gap={10} style={{ justifyContent: "center" }}>
                      <CartActive />
                      <TextContent
                        fontSize={16}
                        fontWeight={700}
                        color={colors.black}
                        style={{ textAlign: "center" }}
                      >
                        Корзина
                      </TextContent>
                    </Flex>
                  </Wave>
                </View> */}
              </Column>
            </View>
            <Promotion />
            <SalesHits />
          </Column>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  box_img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  brend_box: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 50,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: colors.white,
  },
  block_brend: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  catalog_brend: {
    width: "100%",
    height: 38,
    flexDirection: "row",
  },
  remaining_brend_box: {
    position: "absolute",
    bottom: 0,
    left: 94,
    minWidth: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  breand_box: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  favorite_box: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: colors.feuilletOpacity,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  brend_block: {
    height: "100%",
    backgroundColor: colors.phon,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  modal_text_title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
    textAlign: "center",
  },
  modal_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    textAlign: "center",
  },
  modal_block_img: {
    width: 170,
  },
  image_modal: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  apple_check_price: {
    flexDirection: "row",
    gap: 8,
  },
  image_apple: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    bottom: "40%",
  },
  apple_box: {
    flex: 1,
    height: 58,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.phon,
    alignItems: "center",
    justifyContent: "center",
  },
});
