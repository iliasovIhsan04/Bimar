import { stylesAll } from "@/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Main/HeaderAll";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/assets/styles/components/colors";
import Wave from "@/assets/styles/components/Wave";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Button from "@/assets/customs/Button";
import FeaturedImg from "../../assets/svg/featuredImg";
import Flex from "@/assets/styles/components/Flex";
import FavoriteActive from "@/assets/svg/favoriteSctive";
import Shopping from "../../assets/svg/shopping";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;
const FeaturedProducts = () => {
  const [cartFeat, setCartFeat] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInBasket, setIsInBasket] = useState(false);

  useEffect(() => {
    const fetchCartAndFavorites = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cartFeatured");
        const favoritesData = await AsyncStorage.getItem("favorites");
        if (cartData) setCartFeat(JSON.parse(cartData));
        if (favoritesData) setFavoriteItems(JSON.parse(favoritesData));
      } catch (error) {
        console.error("Failed to load cart or favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndFavorites();
  }, []);

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      const cartData = await AsyncStorage.getItem("cartFeatured");
      const cart = JSON.parse(cartData) || [];
      const newCart = cart.filter((el) => el.id !== id);
      await AsyncStorage.setItem("cartFeatured", JSON.stringify(newCart));
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      setCartFeat(newCart);
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false);
    }
  };
  const Basket = async (id, datas) => {
    setIsInBasket(true);
    try {
      const existingItem = await AsyncStorage.getItem(
        `activeItemsBasket_${id}`
      );
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
      await AsyncStorage.setItem(
        `activeItemsBasket_${id}`,
        JSON.stringify(datas)
      );
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
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header container={true} back={true}>
        Избранные
      </Header>
      {loading ? (
        <View style={stylesAll.loading_catalog_page}>
          <ActivityIndicator size="small" color="#008C44" />
        </View>
      ) : cartFeat.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          <View style={styles.catalog_block_all}>
            {cartFeat.map((el, id) => (
              <Wave
                style={styles.cardContainer}
                key={id}
                handle={() => router.push(`/details/ProductId/${el.id}`)}
              >
                <Column gap={10}>
                  <View style={styles.img_block}>
                    <Image style={styles.img_box} source={{ uri: el.img }} />
                    <Flex gap={2}>
                      {el.new && (
                        <View style={styles.new_block}>
                          <TextContent
                            fontSize={10}
                            fontWeight={500}
                            color={colors.white}
                          >
                            NEW
                          </TextContent>
                        </View>
                      )}
                    </Flex>
                    <Wave
                      style={styles.favorite_box}
                      handle={() => deleteItem(el.id)}
                    >
                      <FavoriteActive />
                    </Wave>
                    <Wave
                      style={styles.cart_box}
                      handle={() => {
                        const itemToAdd = cartFeat.find((item) => Number(item.id) === Number(el.id));
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
                        {el.title}
                      </TextContent>
                    </Column>
                    <Flex gap={10}>
                      <TextContent
                        fontSize={16}
                        fontWeight={700}
                        color={colors.black}
                      >
                        {el.price} сом
                      </TextContent>
                    </Flex>
                  </Column>
                </Column>
              </Wave>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={stylesAll.empty_block}>
          <View style={stylesAll.purchase_history}>
            <View style={stylesAll.history_image_box}>
              <FeaturedImg />
            </View>
            <Column gap={12}>
              <TextContent
                fontSize={22}
                fontWeight={600}
                color={colors.black}
                style={{ textAlign: "center" }}
              >
                Пока тут пусто
              </TextContent>
              <Text style={stylesAll.history_text_two}>
                Добавьте в избранное всё, что душе угодно, а мы доставим заказ
                от 150 сом
              </Text>
            </Column>
            <View style={{ width: "100%" }}>
              <Button
                color={colors.feuillet}
                handle={() => router.push("/(tabs)/catalog")}
              >
                Перейти в каталог
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  catalog_block_all: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 150,
    marginTop: 8,
  },
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

export default FeaturedProducts;
