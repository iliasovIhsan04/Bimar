import React, { useEffect, useState, useCallback, memo } from "react";
import { stylesAll } from "@/style";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Main/HeaderAll";
import ButtonLayouts from "@/assets/tabs/buttonLayouts";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import BasketImg from "../../assets/svg/basketImg";
import Column from "@/assets/styles/components/Column";
import Button from "@/assets/customs/Button";

const INITIAL_STATE = {
  cart: [],
  plus: {},
  shopCart: [],
  basket: [],
};
const BasketItem = memo(({ item, plus, onPlus, onMinus, onRemove }) => (
  <View style={styles.product_block} key={item.id}>
    <View style={styles.product_image_block}>
      <Image
        style={styles.product_image}
        source={{ uri: item.img }}
        resizeMode="contain"
      />
    </View>
    <View style={styles.product_info}>
      <TextContent fontSize={14} fontWeight={400} color={colors.black}>
        {item.title}
      </TextContent>
      <View style={styles.price_controls}>
        <TextContent fontSize={18} fontWeight={600} color={colors.feuillet}>
          {item.price} сом
        </TextContent>
        <View style={styles.buttons_block}>
          <TouchableOpacity style={styles.add_remove} onPress={() => onMinus(item.id)}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.basketTxt}>{plus[item.id] || 0}</Text>
          <TouchableOpacity style={styles.add_remove} onPress={() => onPlus(item.id)}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
));

const BasketProducts = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const fetchBasketData = useCallback(async () => {
    try {
      const [storedBasket, storedCart, storedShopCart, storedPlus] = await Promise.all([
        AsyncStorage.getItem("cartsBasket"),
        AsyncStorage.getItem("cart"),
        AsyncStorage.getItem("shopCart"),
        AsyncStorage.getItem("plus"),
      ]);

      setState({
        basket: storedBasket ? JSON.parse(storedBasket) : [],
        cart: storedCart ? JSON.parse(storedCart) : [],
        shopCart: storedShopCart ? JSON.parse(storedShopCart) : [],
        plus: storedPlus ? JSON.parse(storedPlus) : {},
      });
    } catch (error) {
      console.error("Ошибка загрузки данных корзины:", error);
    }
  }, []);

  const calculatePrice = useCallback(async () => {
    try {
      const shopCart = JSON.parse(await AsyncStorage.getItem("shopCart") || "[]");
      const total = shopCart.reduce((acc, item) => {
        return acc + (item.price * (state.plus[item.id] || 0));
      }, 0);
      setCount(total);
    } catch (error) {
      console.error("Ошибка вычисления цены:", error);
    }
  }, [state.plus]);

  const handlePlus = useCallback(async (id) => {
    const item = state.basket.find(el => el.id === id) || state.shopCart.find(el => el.id === id);
    if (!item) return;

    const newPlus = { ...state.plus, [id]: (state.plus[id] || 0) + 1 };
    const updatedShopCart = [...state.shopCart.filter(el => el.id !== id), item];

    await Promise.all([
      AsyncStorage.setItem("shopCart", JSON.stringify(updatedShopCart)),
      AsyncStorage.setItem("plus", JSON.stringify(newPlus))
    ]);

    setState(prev => ({ ...prev, shopCart: updatedShopCart, plus: newPlus }));
    calculatePrice();
  }, [state.basket, state.shopCart, state.plus, calculatePrice]);

  const handleMinus = useCallback(async (id) => {
    const currentCount = state.plus[id] || 0;
    if (currentCount <= 0) return;

    const newPlus = { ...state.plus, [id]: currentCount - 1 };
    await AsyncStorage.setItem("plus", JSON.stringify(newPlus));
    
    if (newPlus[id] === 0) {
      handleRemoveItem(id);
    } else {
      setState(prev => ({ ...prev, plus: newPlus }));
      calculatePrice();
    }
  }, [state.plus, calculatePrice]);

  const handleRemoveItem = useCallback(async (id) => {
    const updatedBasket = state.basket.filter(item => item.id !== id);
    const updatedShopCart = state.shopCart.filter(item => item.id !== id);
    const newPlus = { ...state.plus };
    delete newPlus[id];

    await Promise.all([
      AsyncStorage.setItem("cartsBasket", JSON.stringify(updatedBasket)),
      AsyncStorage.setItem("shopCart", JSON.stringify(updatedShopCart)),
      AsyncStorage.setItem("plus", JSON.stringify(newPlus)),
      AsyncStorage.removeItem(`activeItemsBasket_${id}`)
    ]);

    setState(prev => ({ ...prev, basket: updatedBasket, shopCart: updatedShopCart, plus: newPlus }));
    calculatePrice();
  }, [state.basket, state.shopCart, state.plus, calculatePrice]);

  useEffect(() => {
    fetchBasketData();
  }, [fetchBasketData]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  return (
    <View style={styles.container}>
      <Header container={true} back={true}>Корзина</Header>
      {state.basket.length > 0 ? (
        <ButtonLayouts
          handle={() => router.push("/navigate/PlacingOrder")}
          title="К оформлению"
          end_bot={true}
          kuren={count}
          total_amount={count}
          product_count={state.basket.length}
          name_product_count="Товары:"
          all_count_name="Общая сумма:"
        >
          <View style={stylesAll.background_block}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.scrollContent}>
                {state.basket.map((item) => (
                  <BasketItem
                    key={item.id}
                    item={item}
                    plus={state.plus}
                    onPlus={handlePlus}
                    onMinus={handleMinus}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </ButtonLayouts>
      ) : (
        <View style={stylesAll.empty_block}>
          <View style={stylesAll.purchase_history}>
            <BasketImg />
            <Column gap={12}>
              <TextContent fontSize={22} fontWeight={600} color={colors.black }  style={{ textAlign: "center" }}>
                Пока тут пусто
              </TextContent>
              <Text style={stylesAll.history_text_two}>
                Добавьте в корзину всё, что душе угодно, а мы доставим заказ от 150 сом
              </Text>
            </Column>
            <View style={{width:'100%'}}>
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
  container: { flex: 1, backgroundColor: colors.white },
  scrollView: { paddingTop: 8, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 500 },
  price_controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  product_block: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.phon,
    gap:10
  },
  product_image_block: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.phon,
    overflow: "hidden",
  },
  product_image: { width: "100%", height: "100%" },
  product_info: {
    flex: 1,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  buttons_block: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "space-between",
  },
  add_remove: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: colors.phon,
    justifyContent: "center",
    alignItems: "center",
  },
  basketTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121213",
  },
});

export default memo(BasketProducts);