import { stylesAll } from "@/style";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDown from "@/Modal";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import Header from "../components/Main/HeaderAll";
import Column from "@/assets/styles/components/Column";
import Between from "@/assets/styles/components/Between";
import Flex from "@/assets/styles/components/Flex";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import Arrow from "../assets/svg/more";
import PurchaseIcon from "../assets/svg/purchaseImg";
import FaviriteIcon from "../assets/svg/favoriteIcon";
import CartActive from "../assets/svg/shoppingCartActive";
import Wave from "@/assets/styles/components/Wave";
import SettingIcons from "../assets/svg/settingsIcon";
import MessageIcon from "../assets/svg/mesageIcon";
import ApplicationIcon from "../assets/svg/applicationImg";
import LogoutIcon from "../assets/svg/logout";
import DashboardIcon from "../assets/svg/dashboardIcon";
import Button from "@/assets/customs/Button";
import FaqIcons from "../assets/svg/faq";
import { useCondition } from "@/context/FavoriteContext";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { url } from "@/Api";
import { ScrollView } from "react-native";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [modal, setModal] = useState(false);

  const { changeFirst, setChangeFirst, resetProfile, setResetprofile } =
    useCondition();
  const [imageUri, setImageUri] = useState();

  const chooseImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Нужно разрешение на доступ к галерее");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        base64: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        if (manipulatedImage.uri) {
          setImageUri(manipulatedImage.uri);
          await uploadImage(manipulatedImage.uri);
        } else {
          alert("Ошибка при обработке изображения");
        }
      }
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      alert("Ошибка при выборе изображения");
    }
  };
  const uploadImage = async (uri) => {
    if (!uri) {
      alert("Выберите изображение");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", {
      uri: uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const token = await AsyncStorage.getItem("tokenActivation");
      if (!token) {
        alert("Не удалось получить токен.");
        return;
      }
      const response = await fetch(`${url}/user/update-avatar/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        alert("Фото успешно изменено!");
        setResetprofile(true);
      } else {
        const errorResponse = await response.json();
      }
    } catch (error) {}
  };

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("tokenActivation");
      await AsyncStorage.removeItem("token_block");
      setToken(null);
      router.push("auth/Login");
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };
  const data = useSelector((state) => state.users);
  const user = data?.user;

  useFocusEffect(
    React.useCallback(() => {
      if (changeFirst || resetProfile) {
        dispatch(fetchUserInfo());
        setChangeFirst(false);
        if (resetProfile) {
          setResetprofile(false);
        }
      }
    }, [dispatch, changeFirst, resetProfile])
  );

  return (
    <View>
      <Header container={true}>Профиль</Header>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[stylesAll.container, {marginBottom:200}]}>
          <Column gap={30} top={8}>
            <Wave handle={() => router.push("navigate/MyDetails")}>
              {token ? (
                <Between style={styles.box_prof} center={"center"}>
                  <Flex gap={10}>
                    <Wave style={styles.profile_img_box} handle={chooseImage}>
                      <View style={styles.img_profile}>
                        {imageUri || user?.avatar ? (
                          <Image
                            source={{ uri: imageUri || user?.avatar }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 50,
                            }}
                          />
                        ) : (
                          <DashboardIcon />
                        )}
                      </View>
                    </Wave>
                    <Column gap={4}>
                      <TextContent
                        fontSize={16}
                        fontWeight={500}
                        color={colors.black}
                      >
                        {user?.first_name}
                      </TextContent>
                      <TextContent
                        fontSize={14}
                        fontWeight={400}
                        color={colors.gray}
                      >
                        Личные данные
                      </TextContent>
                    </Column>
                  </Flex>
                  <Arrow />
                </Between>
              ) : (
                <Button
                  handle={() => router.push("auth/Login")}
                  color={colors.feuillet}
                  bottom={10}
                >
                  Войти
                </Button>
              )}
            </Wave>
            <Column>
              <Wave handle={() => router.push("navigate/PurchaseHistory")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <PurchaseIcon />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Мои заказы
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              <Wave handle={() => router.push("navigate/FeaturedProducts")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <FaviriteIcon />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Избранные товары
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              <Wave handle={() => router.push("/navigate/BasketPage")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <CartActive />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Корзина
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
            </Column>
            <Column>
              <Wave handle={() => router.push("navigate/SettingPage")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <SettingIcons />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Настройки
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              <Wave handle={() => router.push("navigate/ToHelp")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <MessageIcon />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Помощь
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              <Wave handle={() => router.push("navigate/AboutTheApplication")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <ApplicationIcon />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      О приложении
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              <Wave handle={() => router.push("navigate/Faq")}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <FaqIcons />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      FAQ
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
            </Column>
            {
              token ? (
                <Wave handle={() => setModal(true)}>
                <Between
                  style={[styles.box_prof, styles.border_bot]}
                  center={"center"}
                >
                  <Flex gap={10}>
                    <LogoutIcon />
                    <TextContent
                      fontSize={16}
                      fontWeight={500}
                      color={colors.black}
                    >
                      Выйти
                    </TextContent>
                  </Flex>
                  <Arrow />
                </Between>
              </Wave>
              ) :(
                ""
              )
            }
            <ModalDown modal={modal} setModal={setModal}>
              <TextContent
                fontSize={20}
                fontWeight={700}
                color={colors.black}
                top={20}
              >
                Выйти с аккаунта?
              </TextContent>
              <TextContent
                fontSize={14}
                fontWeight={400}
                color={colors.gray}
                top={12}
                style={styles.modal_text}
              >
                Вам придется повторно выполнить авторизацию
              </TextContent>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Wave style={styles.btn_cancel} handle={() => setModal(false)}>
                  <Text style={styles.btn_cancel_text}>Отмена</Text>
                </Wave>
                <Wave
                  style={[styles.btn_cancel, styles.btn_confirm]}
                  handle={async () => {
                    await handleLogout();
                    setModal(false);
                  }}
                >
                  <Text style={[styles.btn_cancel_text, styles.btn_text]}>
                    Выйти
                  </Text>
                </Wave>
              </View>
            </ModalDown>
          </Column>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  profile_img_box: {
    width: 60,
    height: 60,
    backgroundColor: colors.feuilletOpacity,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  img_profile: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  box_prof: {
    width: "100%",
    height: 60,
  },
  border_bot: {
    borderBottomWidth: 2,
    borderBottomColor: colors.phon,
  },
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
    marginBottom: 20,
  },
  headerWrapper: {
    overflow: "hidden",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  header_profile: {
    width: "100%",
    height: 160,
    paddingTop: 50,
    paddingBottom: 24,
  },
  profile_text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ProfilePage;
