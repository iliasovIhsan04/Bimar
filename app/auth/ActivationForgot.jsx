import React, { useState,  } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  registerFailure,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import axios from "axios";
import { url } from "@/Api";
import Button from "@/assets/customs/Button";
import { colors } from "@/assets/styles/components/colors";
import Header from "@/components/Main/HeaderAll";

const ForgotActivationCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    if (!code) {
      Alert.alert("Ошибка", "Введите код подтверждения!");
      setLoading(false);
      return;
    }
    if (code.length === 6) {
      const phone = await AsyncStorage.getItem("phone");
      if (!phone) {
        Alert.alert("Ошибка", "Phone number not found!");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${url}/user/reset-password-verify`, {
          phone,
          code,
        });
        dispatch(registerSuccess(response.data));
        if (response.data.response === true) {
          await router.push("auth/ResetPassword");
          Alert.alert("Успешно!", response.data.message, [{ text: "OK" }]);
        }
        setLoading(false);
        if (response.data.response === false) {
          Alert.alert("Ошибка!", response.data.message + "!");
        }
        if (response.data.code) {
          setError(response.data);
        }
        if (response.data.access_token) {
          await AsyncStorage.setItem("token_block", response.data.access_token);
        }
      } catch (error) {
        setError(error.response?.data);
        dispatch(registerFailure(error.message));
        Alert.alert("Ошибка", "Произошла ошибка, повторите попытку позже.");
      }
    } else {
      Alert.alert("Ошибка", "Заполните все поля!");
    }
    setLoading(false);
  };
  
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header back={true}>Новый пароль</Header>
        <Text style={stylesAll.auth_text}>
          Мы отправили 6х значный код на ваш номер телефона
        </Text>
        <View style={{ marginTop: 20, gap: 20 }}>
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
          <Button color={colors.feuillet} handle={handleSubmit} loading={loading} disabled={loading}>Подтвердить</Button>
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
});

export default ForgotActivationCode;
