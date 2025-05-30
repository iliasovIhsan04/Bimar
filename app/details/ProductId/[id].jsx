import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Images from "./Images";
import { url } from "@/Api";
import { useRoute } from "@react-navigation/native";
import { stylesAll } from "@/style";
import MoreLeft from "../../../assets/svg/moreLeft";
import Wave from "@/assets/styles/components/Wave";
import FavoriteIcons from "../../../assets/svg/favorite";
import FavoriteIconsActive from "../../../assets/svg/favoriteSctive";
import ButtonLayouts from "../../../assets/tabs/buttonLayouts";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Flex from "@/assets/styles/components/Flex";
import { colors } from "@/assets/styles/components/colors";
import Loading from "../../../assets/ui/Loading";
import { useCondition } from "@/context/FavoriteContext";
import { ScrollView } from "react-native";

const Productid = () => {
  const route = useRoute();
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [isInBasket, setIsInBasket] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState(new Set());
  const [cart, setCart] = useState([]);
  const { setFavoriteProductId } = useCondition();

  useEffect(() => {
    const initializeData = async () => {
      const cartItems = await AsyncStorage.getItem("cartFeatured");
      if (cartItems) {
        setCart(JSON.parse(cartItems));
      }
      const favoriteItemsKeys = await AsyncStorage.getAllKeys();
      const favoriteIds = favoriteItemsKeys
        .filter((key) => key.startsWith("activeItemFeatured"))
        .map((key) => parseInt(key.replace("activeItemFeatured", "")));
      setFavoriteItems(new Set(favoriteIds));
    };
    initializeData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/core/detail/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const checkFavoritesAndBasket = async () => {
      try {
        const activeItem = await AsyncStorage.getItem(
          `activeItemsBasket_${id}`
        );
        setIsInBasket(!!activeItem);
        const itemExists = await AsyncStorage.getItem(
          `activeItemFeatured${id}`
        );
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

  const Basket = async (id, datas) => {
    setIsInBasket(true);
    try {
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
      await AsyncStorage.setItem(`activeItemsBasket_${id}`, JSON.stringify(id));
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

  if (!data) {
    return <Loading />;
  }

  const saveToAsyncStorage = async (id) => {
    if (!data) return;

    const updatedCart = cart.some((item) => item.id === data.id)
      ? cart.filter((item) => item.id !== data.id)
      : [...cart, data];
    setCart(updatedCart);
    await AsyncStorage.setItem("cartFeatured", JSON.stringify(updatedCart));
  };
  const toggleFavorite = async (id) => {
    const itemExists = await AsyncStorage.getItem(`activeItemFeatured${id}`);
    const updatedFavorites = new Set(favoriteItems);
    if (itemExists) {
      await AsyncStorage.removeItem(`activeItemFeatured${id}`);
      updatedFavorites.delete(id);
      setFavoriteProductId(true);
    } else {
      await AsyncStorage.setItem(`activeItemFeatured${id}`, `${id}`);
      updatedFavorites.add(id);
      setFavoriteProductId(true);
    }
    setFavoriteItems(updatedFavorites);
  };
  return (
    <ButtonLayouts
      title={isInBasket ? "В корзине" : "Добавить в корзину"}
      handle={() =>
        isInBasket ? router.push(`navigate/BasketPage`) : Basket(data?.id, data)
      }
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[stylesAll.background_block, stylesAll.m_bottom]}>
          <View style={[stylesAll.container, { backgroundColor: colors.phon }]}>
            <View style={[stylesAll.header, { paddingBottom: 10 }]}>
              <Wave handle={() => router.back()}>
                <MoreLeft />
              </Wave>
              <Text style={stylesAll.header_name}></Text>
              <Wave
                handle={() => {
                  toggleFavorite(id);
                  saveToAsyncStorage(id);
                }}
              >
                {favoriteItems.has(id) ? (
                  <FavoriteIconsActive />
                ) : (
                  <FavoriteIcons />
                )}
              </Wave>
            </View>
          </View>
            <Images
              data={data?.product_img}
              newBlock={data?.new}
              percentage={data?.discount_percentage}
            />
          <View style={[stylesAll.container, stylesAll.background_block]}>
            <Column bottom={250}>
              <Column gap={40} top={16}>
                <Column gap={6}>
                  <TextContent
                    fontSize={18}
                    fontWeight={600}
                    color={colors.black}
                  >
                    {data?.title}
                  </TextContent>
                </Column>
                <Column gap={20}>
                  <Flex gap={16}>
                    <Column gap={4}>
                      <TextContent
                        fontSize={22}
                        fontWeight={600}
                        color={colors.feuillet}
                      >
                        {data.price} сом
                      </TextContent>
                    </Column>
                    <Column gap={4}>
                      <TextContent
                        fontSize={22}
                        fontWeight={600}
                        color={colors.gray80}
                      >
                        {data?.discount_price}
                      </TextContent>
                    </Column>
                  </Flex>
                  <TextContent
                    fontSize={13}
                    fontWeight={400}
                    color={colors.gray}
                  >
                    Артикул: {data?.code}
                  </TextContent>
                </Column>
              </Column>
              <Column gap={10} top={50} bottom={50}>
                <TextContent
                  fontSize={18}
                  fontWeight={600}
                  color={colors.black}
                >
                  Описание
                </TextContent>
                <TextContent fontSize={14} fontWeight={400} color={colors.gray}>
                  {data.description}
                </TextContent>
              </Column>
            </Column>
          </View>
        </View>
      </ScrollView>
    </ButtonLayouts>
  );
};

export default Productid;
