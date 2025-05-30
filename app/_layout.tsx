import store from "@/Redux/reducer/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { FavoriteProvider } from "../context/FavoriteContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getToken = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setToken(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setToken(null);
    }
  };

  const loadFonts = async (): Promise<void> => {
    try {
      await Font.loadAsync({
        "Lato-Black": require("../assets/fonts/Lato-Black.ttf"),
        "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
        "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
        "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
        "Lato-Thin": require("../assets/fonts/Lato-Thin.ttf"),
      });
    } catch (error) {
      console.error("Font loading error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([getToken(), loadFonts()]);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error("Splash Screen Error:", error);
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      <FavoriteProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="navigate/SettingPage" />
          <Stack.Screen name="navigate/ToHelp" />
          <Stack.Screen name="navigate/AboutTheApplication" />
          <Stack.Screen name="navigate/PurchaseHistory" />
          <Stack.Screen name="navigate/FeaturedProducts" />
          <Stack.Screen name="navigate/MyDetails" />
          <Stack.Screen name="details/[cat]" />
          <Stack.Screen name="navigate/HarryBuyDetails" />
          <Stack.Screen name="navigate/PromotionDetails" />
          <Stack.Screen name="navigate/EmptyAddress" />
          <Stack.Screen name="navigate/NewAddress" />
          <Stack.Screen name="navigate/ProductGiven" />
          <Stack.Screen name="navigate/OnBoarding" />
          <Stack.Screen name="navigate/Fag" />
          <Stack.Screen name="navigate/SalesHits"/>
          <Stack.Screen name="details/HarryDetailsId/[id]" />
          <Stack.Screen name="details/PromotionId/[id]" />
          <Stack.Screen name="details/ProductId/[id]" />
          <Stack.Screen name="details/PurchaseId/[id]" />
          <Stack.Screen name="details/BarrCodeId/[id]" />
          <Stack.Screen name="details/CateoryId/[id]" />
          <Stack.Screen name="navigate/Notifications" />
          <Stack.Screen name="navigate/BasketPage" />
          <Stack.Screen name="navigate/PlacingOrder" />
          <Stack.Screen name="navigate/BrendList" />
          <Stack.Screen name="auth/Registration" />
          <Stack.Screen name="auth/ForgotPassword" />
          <Stack.Screen name="auth/ResetPassword" />
          <Stack.Screen name="auth/Login" />
          <Stack.Screen name="auth/Activation" />
          <Stack.Screen name="auth/ActivationForgot" />
        </Stack>
      </FavoriteProvider>
    </Provider>
  );
}
