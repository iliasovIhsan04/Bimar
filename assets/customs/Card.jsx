import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View, Alert } from "react-native";
import Column from "../../assets/styles/components/Column";
import TextContent from "../styles/components/TextContent";
import { colors } from "../styles/components/colors";
import Wave from "../../assets/styles/components/Wave";
import Flex from "../styles/components/Flex";
import Favorite from "../../assets/svg/favorite";
import FavoriteActive from "../../assets/svg/favoriteSctive";
import Shopping from "../../assets/svg/shopping";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCondition } from "@/context/FavoriteContext";
import { router } from "expo-router";

const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

const Card = ({
  title,
  price,
  id,
  handle,
  data,
  harry,
  love,
  loveDelete,
  harryData,
  img,
}) => {
  const [cart, setCart] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState(new Set());
  const { setFavoriteItemsLocal } = useCondition();
  const [storedToken, setStoredToken] = useState(null);
  const [isInBasket, setIsInBasket] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("tokenActivation");
      setStoredToken(token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const checkFavoritesAndBasket = async () => {
      try {
        const activeItem = await AsyncStorage.getItem(`activeItemsBasket_${id}`);
        setIsInBasket(!!activeItem);
        const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
        setFavoriteItems((prev) => {
          const updatedFavorites = new Set(prev);
          if (itemExists) {
            updatedFavorites.add(id);
          } else {
            updatedFavorites.delete(id);
          }
          return updatedFavorites;
        });
      } catch (error) {
        console.error("Ошибка при проверке избранного или корзины:", error);
      }
    };
    checkFavoritesAndBasket();
  }, [id]);

  const toggleFavorite = async (id) => {
    try {
      const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
      const storedCart = await AsyncStorage.getItem("cartFeatured");
      let updatedCart = storedCart ? JSON.parse(storedCart) : [];

      if (itemExists) {
        await AsyncStorage.removeItem(`activeItemFeatured${id}`);
        updatedCart = updatedCart.filter((item) => item.id !== id);
      } else {
        await AsyncStorage.setItem(`activeItemFeatured${id}`, `${id}`);
        const itemToAdd = (harry || data || harryData).find(
          (item) => item.id === id
        );
        if (itemToAdd) {
          updatedCart.push(itemToAdd);
        }
      }
      await AsyncStorage.setItem("cartFeatured", JSON.stringify(updatedCart));
      setCart(updatedCart);
      setFavoriteItemsLocal(true);
      initializeData();
    } catch (error) {
      console.error("Ошибка при обновлении ID:", error);
    }
  };

  const initializeData = async () => {
    try {
      const cartItems = await AsyncStorage.getItem("cartFeatured");
      if (cartItems) {
        setCart(JSON.parse(cartItems));
      }
      const favoriteItemsKeys = await AsyncStorage.getAllKeys();
      const favoriteIds = favoriteItemsKeys
        .filter((key) => key.startsWith("activeItemFeatured"))
        .map((key) => parseInt(key.replace("activeItemFeatured", "")));
      setFavoriteItems(new Set(favoriteIds));
    } catch (error) {
      console.error(
        "Ошибка при восстановлении данных:",
        error
      );
    }
  };
  useEffect(() => {
    initializeData();
  }, []);

  const handleFavoriteToggle = () => {
    toggleFavorite(id);
  };

  const Basket = async (id, datas) => {
    setIsInBasket(true);
    try {
      const existingItem = await AsyncStorage.getItem(`activeItemsBasket_${id}`);
      if (existingItem) {
        Alert.alert("Уже сохранен", "Этот товар уже добавлен в корзину.");
        return;
      }
      const prevIDString = await AsyncStorage.getItem("plus");
      const prevID = prevIDString !== null ? JSON.parse(prevIDString) : {};
      const updatedPrevID = { ...prevID, [id]: 1 };
      await AsyncStorage.setItem("plus", JSON.stringify(updatedPrevID));
      await AsyncStorage.setItem("plusOne", JSON.stringify(updatedPrevID));
      const prevShopCartString = await AsyncStorage.getItem("shopCart");
      const prevShopCart =
        prevShopCartString !== null ? JSON.parse(prevShopCartString) : [];
      const updatedShopCart = [...prevShopCart, datas];
      await AsyncStorage.setItem("shopCart", JSON.stringify(updatedShopCart));
      const prevCartsString = await AsyncStorage.getItem("cartsBasket");
      const prevCarts =
        prevCartsString !== null ? JSON.parse(prevCartsString) : [];
      const updatedCarts = [...prevCarts, datas];
      await AsyncStorage.setItem("cartsBasket", JSON.stringify(updatedCarts));
      await AsyncStorage.setItem(`activeItemsBasket_${id}`, JSON.stringify(datas));
      const activeItem = await AsyncStorage.getItem(`activeItemsBasket_${id}`);
      if (activeItem) {
        Alert.alert("Ваш товар успешно добавлен в корзину!");
      } else {
        Alert.alert("Ошибка", "Не удалось добавить товар в корзину");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при добавлении товара в корзину");
      console.error(error);
    }
  };
  
  return (
    <Wave style={styles.cardContainer} key={id} handle={handle}>
      <Column gap={10}>
        <View style={styles.img_block}>
          <Image style={styles.img_box} source={{ uri: img }} />
          <Flex gap={2}>
          </Flex>
          {love && (
            <Wave
              style={styles.favorite_box}
              handle={
                Boolean(storedToken) ? handleFavoriteToggle : () => router.push("auth/Login")
              }
            >
              {favoriteItems.has(id) ? <FavoriteActive /> : <Favorite />}
            </Wave>
          )}
          {loveDelete && (
            <Wave
              style={styles.favorite_box}
              handle={
                Boolean(storedToken)
                  ? handleFavoriteToggle
                  : () => router.push("auth/Login")
              }
            >
              {favoriteItems.has(id) ? <FavoriteActive /> : <Favorite /> }
            </Wave>
          )}
          <Wave
            style={styles.cart_box}
            handle={() => {
              const itemToAdd = (harry || data || harryData).find((item) => item.id === id);
              if (itemToAdd) {
                Basket(itemToAdd.id, itemToAdd);
              } else {
                console.error("Item not found");
              }
            }}
          >
            <Shopping />
          </Wave>
        </View>
        <Column gap={8}>
          <Column gap={6}>
            <TextContent
              fontSize={14}
              fontWeight={500}
              color={colors.black}
              numberOfLines={1}
              style={{ width: "80%" }}
            >
              {title}
            </TextContent>
            {/* <TextContent
              fontSize={13}
              fontWeight={400}
              color={colors.gray}
              numberOfLines={2}
              style={{ minHeight: 33 }}
            >
              {mini_description}
            </TextContent> */}
          </Column>
          <Flex gap={10}>
            <TextContent fontSize={16} fontWeight={700} color={colors.black}>
              {price} сом
            </TextContent>
            {/* {old_price && (
              <View style={{ position: "relative" }}>
                <TextContent
                  fontSize={14}
                  fontWeight={600}
                  color={colors.gray2}
                >
                  {old_price} сом
                </TextContent>
                <View style={styles.line_price}></View>
              </View>
            )} */}
          </Flex>
        </Column>
      </Column>
    </Wave>
  );
};

const styles = StyleSheet.create({
  line_price: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray2,
    position: "absolute",
    top: 10,
  },
  cart_box: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: colors.feuillet,
    position: "absolute",
    bottom: -14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: containerWidth,
    marginBottom: 6,
  },
  present_box: {
    backgroundColor: colors.late,
    minWidth: 34,
  },
  new_block: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  img_block: {
    width: "100%",
    backgroundColor: colors.phon,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    position: "relative",
  },
  img_box: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    borderRadius: 6,
  },
  favorite_box: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default Card;
