import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "@/Api";
import axios from "axios";
import { TextInputMask } from "react-native-masked-text";
import Button from "@/assets/customs/Button";
import { colors } from "@/assets/styles/components/colors";
import Header from "@/components/Main/HeaderAll";


const Login = () => {
  const [errorActivation, setErrorActivation] = useState({});
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLoginEvent = async () => {
    setIsLoading(true);
    const phoneNumber =
      "+996 " + phone.slice(0, 3) + phone.slice(3, 6) + phone.slice(6);

      let userCredential = {
        phone:phoneNumber, 
        password
      }
      const handleCode = () => {
        axios.post(url+ "/auth/send-code", userCredential)
      }
    try {
      const response = await axios.post(`${url}/user/auth/login/`, userCredential);
      if (response.data) {
        setErrorActivation(response.data);
      }
      if (response.data.response === true) {
        router.push("/");
        Alert.alert("Успешно!", "Вы успешно вошли в систему.");
      } else if (response.data.response === false) {
        Alert.alert("Ошибка!", response.data.message || "Произошла ошибка");
      }

      if (response.data.isactivated === false) {
        await AsyncStorage.setItem("phone", phone.replace(/\D/g, ""));
        router.push("auth/Activation");
        handleCode()
      }

      if (response.data.access_token) {
        await AsyncStorage.setItem("tokenActivation", response.data.access_token);
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert(
        "Ошибка!",
        error.message || "Произошла непредвиденная ошибка"
      );
      setIsLoading(false);
    }
  };
  const handlePassword = () => setVisible(!visible);

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
<Header handleBack={('/')}>Войти</Header>
        <Text style={stylesAll.auth_text}>
          Введите свои данные для авторизации
        </Text>
        <View style={stylesAll.input_block_all}>
          <View style={styles.input_block}>
            <Text style={stylesAll.label}>Номер телефона</Text>
            <View style={stylesAll.phone_input_mask_block}>
              <Text>+996</Text>
              <TextInputMask
                type={"custom"}
                options={{ mask: "(999) 99-99-99" }}
                value={phone}
                onChangeText={setPhone}
                style={[
                  stylesAll.input,
                  stylesAll.input_mask,
                  styles.input_box,
                ]}
                placeholder="(700) 10-20-30"
                keyboardType="phone-pad"
              />
            </View>
            {errorActivation.phone && (
              <Text style={styles.error_text_registr}>
                {errorActivation.phone[0]}
              </Text>
            )}
          </View>
          <View style={styles.input_block}>
            <Text style={stylesAll.label}>Пароль</Text>
            <View style={styles.password_container}>
              <TextInput
                style={[
                  stylesAll.input,
                  styles.input_box,
                  styles.password_input,
                ]}
                placeholder="Введите пароль"
                placeholderTextColor="#888"
                secureTextEntry={!visible}
                onChangeText={setPassword}
                value={password}
                keyboardType="default"  
              />
              <TouchableOpacity onPress={handlePassword}>
                <Ionicons
                  name={visible ? "eye" : "eye-off"}
                  size={20}
                  style={styles.ab_eye}
                />
              </TouchableOpacity>
            </View>
            {errorActivation.password && (
              <Text style={styles.error_text_registr}>
                {errorActivation.password[0]}
              </Text>
            )}
          </View>
          <Text
            style={styles.forgot_password_text}
            onPress={() => router.push("auth/ForgotPassword")}
          >
            Забыл(-а) пароль?
          </Text>
          <View style={{ gap: 10 }}>
            <Button handle={handleLoginEvent} loading={isLoading} disabled={isLoading} color={colors.feuillet}>Войти</Button>
            <Text
              style={styles.yes_text}
              onPress={() => router.push("auth/Registration")}
            >
              Еще нет аккаунта?{" "}
              <Text style={styles.terms_red}>Зарегистрироваться</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  yes_text: {
    fontSize: 12,
    fontWeight: "400",
    color: "#191919",
    textAlign: "center",
  },
  terms_red: {
    color: colors.feuillet,
  },
  forgot_password_text: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.feuillet,
    marginLeft: "auto",
  },
  input_block: {
    flexDirection: "column",
  },
  input_box: {
    backgroundColor:colors.phon,
  },
  password_input: {
    flex: 1,
    position: "relative",
  },
  ab_eye: {
    position: "absolute",
    top: -10,
    right: 10,
    zIndex: 1,
    width: 24,
    height: 24,
    color: "#AAAAAA",
  },
  password_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  error_text_registr: {
    color: colors.feuillet,
    fontSize: 12,
    marginTop: 5,
  },
});

export default Login;
