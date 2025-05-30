import { router, Tabs, useNavigation } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { stylesAll } from "../../style";
import Main from "../../assets/svg/main";
import MainActive from "../../assets/svg/mainActive";
import Delivery from "../../assets/svg/delivery";
import DeliveryActive from "../../assets/svg/delveryActive";
import Profile from "../../assets/svg/user";
import ProfileActive from "../../assets/svg/userActive";
import GrCode from "../../assets/svg/grCod";
import { colors } from "../../assets/styles/components/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FaviriteIcon from "../../assets/svg/favoriteIcon";
import FaviriteIconActive from "../../assets/svg/favoriteSctive";

export default function TabLayout() {
  const [storedToken, setStoredToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("tokenActivation");
      setStoredToken(token);
    };
    fetchToken();
  }, []);

  const renderTabIcon = (focused, ActiveIcon, InactiveIcon) => {
    const widthAnim = useRef(new Animated.Value(focused ? 60 : 0)).current;

    useEffect(() => {
      Animated.timing(widthAnim, {
        toValue: focused ? 60 : 0,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }, [focused]);

    const animatedWidth = widthAnim.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 60],
    });

    return (
      <View style={{ alignItems: "center" }}>
        {focused && (
          <Animated.View
            style={{
              width: animatedWidth,
              height: 5,
              backgroundColor: colors.bimar_color,
              position: "absolute",
              top: -18,
              borderBottomEndRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          />
        )}
        <View>{focused ? <ActiveIcon /> : <InactiveIcon />}</View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.bimar_color,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
        tabBarStyle: {
          ...(Platform.OS === "android" && {
            height: 70,
            paddingBottom: 10,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginBottom: -15,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ focused }) => renderTabIcon(focused, MainActive, Main),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: focused ? colors.bimar_color : colors.gray,
              }}
            >
              {focused ? "Главная" : null}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Каталог",
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, DeliveryActive, Delivery),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: focused ? colors.bimar_color : colors.gray,
              }}
            >
              {focused ? "Каталог" : null}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="qrCode"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={stylesAll.footer_absolute}>
              {focused ? <GrCode /> : <GrCode />}
            </View>
          ),
          tabBarButton: (props) => {
            const handlePress = async () => {
              const token = await AsyncStorage.getItem("tokenActivation");
              if (token) {
                props.onPress();
              } else {
                router.push("auth/Login");
              }
            };
            return <TouchableOpacity {...props} onPress={handlePress} />;
          },
        }}
      />
      <Tabs.Screen
        name="favoritePage"
        options={{
          title: "Избранное",
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, FaviriteIconActive, FaviriteIcon),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: focused ? colors.bimar_color : colors.gray,
              }}
            >
              {focused ? "Избранное" : null}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, ProfileActive, Profile),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: focused ? colors.bimar_color : colors.gray,
              }}
            >
              {focused ? "Профиль" : null}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
