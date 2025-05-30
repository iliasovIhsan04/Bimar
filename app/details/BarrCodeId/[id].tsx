import { url } from "@/Api";
import { stylesAll } from "@/style";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import Images from "../ProductId/Images";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: number;
  title: string;
  preview_img: string;
  price: number;
  old_price: string;
  wholesale_price: number;
  description: string;
  sales: number;
  status: boolean;
  sub_cat: number;
  created_at: string;
  updated_at: string;
  quantity: number | null;
  price_for: string;
  code: number;
  img: {
    id: number;
    img: string;
  }[];
}

const BarrCodeId = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const notFound = id && id.includes("notFound=true");
  const [isInBasket, setIsInBasket] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id: string) => {
    try {
      const response = await axios.get(`${url}/product/barrcode/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const cartItems = await AsyncStorage.getItem("cartFeatured");
      if (cartItems) {
        setCart(JSON.parse(cartItems));
      }

      const favoriteIds = await getFavoriteIds();
      setFavoriteItems(new Set(favoriteIds));
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  const getFavoriteIds = async () => {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter((key) => key.startsWith("activeItemFeatured"))
      .map((key) => parseInt(key.replace("activeItemFeatured", "")));
  };

  useEffect(() => {
    if (data) {
      checkFavoritesAndBasket();
    }
  }, [data]);

  const checkFavoritesAndBasket = async () => {
    if (!data || !data.id) return;
    try {
      const activeItem = await AsyncStorage.getItem(
        `activeItemsBasket_${data.id}`
      );
      setIsInBasket(!!activeItem);
      const itemExists = await AsyncStorage.getItem(
        `activeItemFeatured${data.id}`
      );

      const updatedFavorites = new Set(favoriteItems);
      if (itemExists) {
        updatedFavorites.add(data.id);
      } else {
        updatedFavorites.delete(data.id);
      }
      setFavoriteItems(updatedFavorites);
    } catch (error) {
      console.error("Error checking favorites or basket:", error);
    }
  };

  const saveToAsyncStorage = async (id: number) => {
    if (!data) return;
    const updatedCart = cart.some((item) => item.id === data.id)
      ? cart.filter((item) => item.id !== data.id)
      : [...cart, data];

    setCart(updatedCart);
    await AsyncStorage.setItem("cartFeatured", JSON.stringify(updatedCart));
  };

  const toggleFavorite = async (id: number) => {
    const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
    const updatedFavorites = new Set(favoriteItems);
    try {
      if (itemExists) {
        await AsyncStorage.removeItem(`activeItemFeatured${id}`);
        updatedFavorites.delete(id);
      } else {
        await AsyncStorage.setItem(`activeItemFeatured${id}`, `${id}`);
        updatedFavorites.add(id);
      }
      setFavoriteItems(updatedFavorites);
      setIsInBasket(false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const Basket = async (id: number, datas: Product) => {
    setIsInBasket(true);
    try {
      await updateAsyncStorageWithItem(id, datas);
      Alert.alert("Ваш товар успешно добавлен в корзину!");
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при добавлении товара в корзину");
      console.error(error);
    }
  };

  const updateAsyncStorageWithItem = async (id: number, datas: Product) => {
    const prevIDString = await AsyncStorage.getItem("plus");
    const prevID = prevIDString !== null ? JSON.parse(prevIDString) : {};
    const updatedPrevID = { ...prevID, [id]: 1 };

    await AsyncStorage.multiSet([
      ["plus", JSON.stringify(updatedPrevID)],
      ["plusOne", JSON.stringify(updatedPrevID)],
      ["shopCart", JSON.stringify(await addToCart(datas))],
      ["cartsBasket", JSON.stringify(await addToBasket(datas))],
      [`activeItemsBasket_${id}`, JSON.stringify(id)],
    ]);
  };

  const addToCart = async (datas: Product) => {
    const prevShopCartString = await AsyncStorage.getItem("shopCart");
    const prevShopCart =
      prevShopCartString !== null ? JSON.parse(prevShopCartString) : [];
    return [...prevShopCart, datas];
  };

  const addToBasket = async (datas: Product) => {
    const prevCartsString = await AsyncStorage.getItem("cartsBasket");
    const prevCarts =
      prevCartsString !== null ? JSON.parse(prevCartsString) : [];
    return [...prevCarts, datas];
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={stylesAll.header}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/navigate/ProductGiven")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Товар</Text>
          <Pressable
            onPress={() => {
              toggleFavorite(data.id);
              saveToAsyncStorage(data.id);
            }}
            style={styles.heart_img_box}
          >
            <Image
              source={
                data && data.id && favoriteItems.has(data.id)
                  ? require("../../../assets/images/heart_card_new.png")
                  : require("../../../assets/images/heart_card.png")
              }
              style={styles.heart_img}
            />
          </Pressable>
        </View>
      </View>
      {loading ? (
        <View style={stylesAll.loading_catalog_page}>
          <ActivityIndicator size="small" color="#DC0200" />
        </View>
      ) : (
        <>
          {notFound ? (
            <View style={stylesAll.loading_catalog_page}>
              <Text style={stylesAll.barrcode_page_text}>Товар не найден!</Text>
            </View>
          ) : (
            <>
              {data?.status === true ? (
                <>
                  <Images data={data.img} />
                  <View style={stylesAll.container}>
                    <View style={styles.product_block}>
                      <Text style={styles.product_title}>{data.title}</Text>
                      <View
                        style={{ flexDirection: "column", gap: 5, marginTop: 16 }}
                      >
                        <View style={styles.row}>
                          <Text style={styles.product_name}>Артикул:</Text>
                          <Text style={styles.product_code}>{data.code}</Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.product_name}>
                            1 {data.price_for}
                          </Text>
                          <Text style={[styles.product_old_price, styles.price]}>
                            {data.price}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.product_name}>По карте</Text>
                          <Text style={styles.product_old_price}>
                            {data.old_price}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: "column", gap: 10, marginTop: 30 }}
                      >
                        <Text style={styles.description_name}>Описание:</Text>
                        <Text style={styles.description_text}>
                          {data.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[stylesAll.button, styles.btn_product]}
                    onPress={() =>
                      isInBasket
                        ? router.push(`navigate/BasketPage`)
                        : Basket(data.id, data)
                    }
                  >
                    <Text style={stylesAll.button_text}>
                      {isInBasket ? "В корзине" : "Добавить в корзину"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={stylesAll.loading_catalog_page}>
                  <Text style={stylesAll.barrcode_page_text}>Товар не найден!</Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btn_product: {
    position: "absolute",
    width: "90%",
    bottom: 30,
    margin: "auto",
    alignSelf: "center",
  },
  description_name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
  },
  product_block: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  description_text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
  },
  price: {
    color: "#191919",
  },
  product_old_price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DC0200",
  },
  product_code: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  product_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#191919",
  },
  product_name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heart_img_box: {
    alignItems: "center",
  },
  heart_img: {
    width: 24,
    height: 24,
  },
});

export default BarrCodeId;
