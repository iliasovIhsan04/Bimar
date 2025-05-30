import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "@/Redux/reducer/slice/ActivationReducerSlice";
import { url } from "@/Api";
import Button from "@/assets/customs/Button";
import { colors } from "@/assets/styles/components/colors";
import Header from "@/components/Main/HeaderAll";

const ResetPassword = () => {
  const [errorActivation, setErrorActivation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localToken, setLocalToken] = useState(null);
  const dispatch = useDispatch();

React.useEffect(() => {
  const fetchToken = async () => {
    try {
      setTimeout(async () => {
        const token = await AsyncStorage.getItem("token_block");
        setLocalToken(token);
      }, 500); 
    } catch (error) {
      console.error("Ошибка при получении токена:", error);
    }
  };
  fetchToken();
}, []);
  
  const headers = {
    Authorization: `Bearer ${localToken}`,
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Ошибка", "Пожалуйста, введите оба пароля.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают.");
      return;
    }
    setIsLoading(true);
    const newPasswordCredential = {
      password,
      confirm_password: confirmPassword,
    };
    dispatch(registerStart());
    try {
      const response = await axios.post(
        `${url}/user/change-password`,
        newPasswordCredential,
        { headers }
      );
      dispatch(registerSuccess(response.data));

      if (response.data.response === true) {
        Alert.alert("Успешно!", response.data.message);
        router.push("auth/Login");
      } else {
        Alert.alert("Ошибка", response.data.message || "Произошла ошибка");
        setErrorActivation(response.data);
      }
    } catch (error) {
      dispatch(registerFailure(error.message));
      Alert.alert("Ошибка", error.message || "Произошла непредвиденная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
   <Header back={true}>Новый пароль</Header>
        <Text style={stylesAll.auth_text}>Придумайте новый пароль</Text>
        <View style={styles.input_block}>
          <Text style={stylesAll.label}>Пароль</Text>
          <TextInput
            style={[stylesAll.input, styles.input_box]}
            placeholder="Введите пароль"
            placeholderTextColor="#888"
            onChangeText={setPassword}
            value={password}
          />
          {errorActivation.password && (
            <Text style={styles.error_text_registr}>
              {errorActivation.password[0]}
            </Text>
          )}
        </View>
        <View style={styles.input_block}>
          <Text style={stylesAll.label}>Повторите пароль</Text>
          <TextInput
            style={[stylesAll.input, styles.input_box]}
            placeholder="Повторите пароль"
            placeholderTextColor="#888"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          {errorActivation.confirm_password && (
            <Text style={styles.error_text_registr}>
              {errorActivation.confirm_password[0]}
            </Text>
          )}
        </View>
      <Button handle={handleSubmit} color={colors.feuillet} loading={isLoading} disabled={isLoading} top={10}>Сохранить</Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input_block: {
    flexDirection: "column",
    marginVertical: 10,
  },
  input_box: {
    backgroundColor: colors.phon,
  },
  error_text_registr: {
    color: colors.feuillet,
    fontSize: 12,
    marginTop: 5,
  },
});

export default ResetPassword;
