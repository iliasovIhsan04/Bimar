import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import {
  registerFailure,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";
import OTPTextInput from "react-native-otp-textinput";
import { stylesAll } from "../../style";
import Button from "@/assets/customs/Button";
import { colors } from "@/assets/styles/components/colors";
import Header from "@/components/Main/HeaderAll";
import Wave from "@/assets/styles/components/Wave";

const ActivationCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCode = async () => {
    const phone = await AsyncStorage.getItem("phone");
    if (phone) {
      await axios.post(`${url}/user/send-code`, { phone });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!code) {
      Alert.alert("Ошибка!", "Введите код подтверждения!");
      setLoading(false);
      return;
    }
    
    if (code.length === 6) {
      try {
        const phone = await AsyncStorage.getItem("phone");
        if (phone) {
          const response = await axios.post(`${url}/user/verify-phone/`, {
            phone,
            code,
          });
          dispatch(registerSuccess(response.data));
          if (response.data.response === false) {
            Alert.alert("Ошибка", response.data.message + "!");
          }
          if (response.data.access_token) {
            await AsyncStorage.setItem("tokenActivation", response.data.access_token);
          }
          if (response.data.response === true) {
            router.push({
              pathname: "/",
              params: { showModal: true, pushModal: true },
            });
          }
          if (response.data.code) {
            Alert.alert("Ошибка!", response.data.code + "!");
          }
        }
      } catch (error) {
        dispatch(registerFailure((error).message));
        Alert.alert("Ошибка", "Произошла ошибка.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Ошибка!", "Заполните все поля!");
      setLoading(false);
    }
  };

  return (
    <View style={[stylesAll.container, {flex:1}, {backgroundColor:colors.white}]}>
      <Header back={true}>Код потверждения</Header>
      <Text style={[stylesAll.auth_text, { marginTop: 12 }]}>
        Мы отправили 6х значный код на ваш номер телефона
      </Text>
      <View style={{ gap: 20, marginTop: 20 }}>
        <View>
          <Text style={[stylesAll.label, styles.activation_label]}>
            Код потверждения
          </Text>
          <View style={styles.otpContainer}>
            <OTPTextInput
              inputCount={6}
              handleTextChange={(otp) => setCode(otp)}
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
              tintColor={colors.feuillet}
              defaultValue={code}
            />
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <Button color={colors.feuillet} handle={handleSubmit} loading={loading} disabled={loading}>Потвердить код</Button>
          <Wave handle={handleCode}>
          <Text style={styles.send_again}>
            Отправить снова
          </Text>
          </Wave>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    textAlign: "center",
    color: "#000",
    width: "15%",
    margin: 0,
    padding: 0,
  },
  otpContainer: {
    width: "100%",
    flexWrap: "nowrap",
  },
  activation_label: {
    fontSize: 14,
  },
  send_again: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.feuillet,
    textAlign: "center",
  },
});

export default ActivationCode;
