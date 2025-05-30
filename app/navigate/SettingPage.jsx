import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDown from "@/Modal";
import axios from "axios";
import { url } from "@/Api";
import Header from "@/components/Main/HeaderAll";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
const SettingPage = () => {
  const [isPetONe, setIsPetOne] = useState(false);
  const [isPetTwo, setIsPetTwo] = useState(false);
  const [modal, setModal] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("tokenActivation");
        setToken(storedToken);
      } catch (error) {
        console.error("Error retrieving token:", error);
        setToken(null);
      }
    };

    fetchToken();
  }, [])

  const deleteAccount = async () => {
    try {
      const local = await AsyncStorage.getItem("tokenActivation");
      const headers = {
        Authorization: `Bearer ${local}`,
      };
      const response = await axios.get(url + "/user/logout", {
        headers,
      });
      if (response.data.response === true) {
        Alert.alert("Success", response.data.message);
        await AsyncStorage.removeItem("tokenActivation");
        await AsyncStorage.removeItem("token_block");
        router.push("/auth/Registration");
      }
    } catch (error) {
    }
  };

  const toggleSwitchOne = async () => {
    const newValue = !isPetONe;
    setIsPetOne(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem("notifications", JSON.stringify(newValue));
      } else {
        await AsyncStorage.removeItem("notifications");
      }
    } catch (error) {
      console.error("Failed to save switch state to AsyncStorage:", error);
    }
  };
  const toggleSwitchTwo = async () => {
    const newValue = !isPetTwo;
    setIsPetTwo(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem("auto_brightness", JSON.stringify(newValue));
      } else {
        await AsyncStorage.removeItem("auto_brightness");
      }
    } catch (error) {
      console.error("Failed to save switch state to AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.settings_block}>
      <View style={stylesAll.container}>
      <Header handleBack={('/(tabs)/profile')}>Настройки</Header>
        <View style={styles.settings_cart_block}>
          <View style={styles.settings_box}>
            <View
              style={{
                flexDirection: "column",
                gap: 6,
                width: 240,
              }}
            >
              <Text style={styles.setting_notifications}>Уведомления</Text>
              <Text style={styles.setting_notifications_text}>
                Получайте уведомления об акциях и социальных предложениях
              </Text>
            </View>
            <Switch
             trackColor={{ false: "#D2D2D2", true: "#008C44" }}
              thumbColor={isPetTwo ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#D2D2D2"
              onValueChange={toggleSwitchOne}
              value={isPetONe}
            />
          </View>
          <View style={styles.settings_box}>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                width: 240,
              }}
            >
              <Text style={styles.setting_notifications}>Автояркость</Text>
              <Text style={styles.setting_notifications_text}>
                Автояркость нужна для корректного считывания шрихкода
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D2D2D2", true: "#008C44" }}
              thumbColor={isPetTwo ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#D2D2D2"
              onValueChange={toggleSwitchTwo}
              value={isPetTwo}
            />
          </View>
        </View>
        {
          token ? (
            <Pressable style={{ marginTop: 20 }} onPress={() => setModal(true)}>
            <Text style={styles.remove_accaunt}>Удалить аккаунт</Text>
          </Pressable>
          ) : ""
        }
        <ModalDown modal={modal} setModal={setModal}>
        <TextContent
              fontSize={20}
              fontWeight={700}
              color={colors.black}
              top={20}
            >
              Удалить с аккаунта?
            </TextContent>
            <TextContent
              fontSize={14}
              fontWeight={400}
              color={colors.gray}
              top={12}
              style={styles.modal_text}
            >
             Ваш аккаунт удалится насвегда, и вам придется заново
             зарегистрироваться
            </TextContent>
          <View style={{ flexDirection: "row", gap: 10 }}>
          <Wave style={styles.btn_cancel} handle={() => setModal(false)}>
                <Text style={styles.btn_cancel_text}>Отмена</Text>
              </Wave>
                  <Wave
                  style={[styles.btn_cancel, styles.btn_confirm]}
                  handle={async () => {
                    await deleteAccount();
                    setModal(false);
                  }}
                >
                  <Text style={[styles.btn_cancel_text, styles.btn_text]}>
                    Удалить
                  </Text>
                </Wave>
          </View>
        </ModalDown>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn_confirm: {
    backgroundColor: colors.feuillet,
  },
  btn_text: {
    color: "#FFFFFF",
  },
  btn_cancel_text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  btn_cancel: {
    width: "48%",
    height: 45,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modal_title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
  },
  modal_text: {
    width: "80%",
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  header_back_btn: {
    width: 30,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  settings_box: {
    width: "100%",
    backgroundColor: colors.phon,
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settings_block: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  settings_cart_block: {
    flexDirection: "column",
    gap: 10,
    marginTop:8
  },
  setting_notifications: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  setting_notifications_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  remove_accaunt: {
    fontSize: 16,
    fontWeight: "700",
    color:colors.feuillet,
  },
});

export default SettingPage;
