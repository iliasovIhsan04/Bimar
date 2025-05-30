import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/reducer/store";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from '../../components/Main/HeaderAll'
import ButtonLayouts from "@/assets/tabs/buttonLayouts";
import AddresIcon from '../../assets/svg/addressimg'
import CalendarIcons from '../../assets/svg/calendar'
import WalletIcon from '../../assets/svg/walletImg'
import { colors } from "@/assets/styles/components/colors";
import Flex from "@/assets/styles/components/Flex";
import Between from "@/assets/styles/components/Between";
import Wave from "@/assets/styles/components/Wave";
import Arrow from '../../assets/svg/more'
import { ScrollView } from "react-native";
import Button from "@/assets/customs/Button";


const PlacingOrder = () => {
  const [local, setLocal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [plus, setPlus] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [date1, setDate1] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [datePicker, setDatePicker] = useState<boolean>(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  
  const [basket, setBasket] = useState([])
  const selectedAddressId = useSelector(
    (state: RootState) => state.selectedAddress.selectedAddress
  );
  const addressId = useSelector(
    (state: RootState) => state.selectedAddress.selectedId
  );
  const [address, setAddress] = useState({
    address: "",
    get_date: "",
    comment: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const tokens = await AsyncStorage.getItem("tokenActivation");
        const cartData = await AsyncStorage.getItem("cartFeatured");
        setLocal(tokens);
        setCart(cartData ? JSON.parse(cartData) : []);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const plusData = await AsyncStorage.getItem("plus");
        const parsedPlus = plusData ? JSON.parse(plusData) : {};
        setPlus(parsedPlus);
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };
    fetchTotalPrice();
  }, []);
  
  const headers = {
    Authorization: `Bearer ${local}`,
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const shopCart = await AsyncStorage.getItem("shopCart");
      const parsedShopCart = shopCart ? JSON.parse(shopCart) : [];
      const productsForOrder = parsedShopCart.map((el) => ({
        product: el.id,
        count: plus[el.id] || 0,
      }));
      const dataToSend = {
        address: addressId ? addressId : address.address,
        get_date: address.get_date || null, 
        comment: address.comment,
        product_for_order: productsForOrder.filter((item) => item.count > 0),
      };
      const response = await axios.post(url + "/core/create/order/", dataToSend, {
        headers,
      });
      if (response.data.response === true) {
        await AsyncStorage.multiRemove([
          "plus",
          "plusOne",
          "shopCart",
          "cartsBasket",
          "cartFeatured",
        ]);
        for (const el of parsedShopCart) {
          await AsyncStorage.removeItem(`activePlus_${el.id}`);
          await AsyncStorage.removeItem(`activeItemsBasket_${el.id}`);
        }
        for (const el of cart) {
          await AsyncStorage.removeItem(`activeItemFeatured${el.id}`);
        }
        setOpenModal(true);
      } else {
        Alert.alert("Ошибка", "Не удалось создать заказ");
      }
    } catch (error) {
      console.error("Error during order placement:", error);
      if (!address.get_date && !date1) {
        Alert.alert("Ошибка", "Выберите время получения");
      } else if (!address.address) {
        Alert.alert("Ошибка", "Добавьте адрес прежде чем заказать!");
      }
      setIsLoading(false);
    }
  };
  const calculateTotalPrice = async () => {
    const shopCart = await AsyncStorage.getItem("shopCart");
    const parsedCart = shopCart ? JSON.parse(shopCart) : [];
    const total = parsedCart.reduce((acc: number, item: any) => {
      const itemTotal = item.price * plus[item.id];
      return acc + itemTotal;
    }, 0);

    setTotalPrice(total);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  useEffect(() => {
    if (openModal) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [openModal]);

  useEffect(() => {
    const fetchPlacing = async () => {
      const storedBasket = await AsyncStorage.getItem("cartsBasket");
      setBasket(storedBasket ? JSON.parse(storedBasket) : []);
    };
    fetchPlacing();
  }, []);

const basket_count= basket?.length
  return (
    <ButtonLayouts title={'Оформить заказ'} handle={local ? handleSubmit : () => router.push('auth/Login')} end_bot={true} name_product_count={'Товары:'} all_count_name={'Общая сумма:'} total_amount={totalPrice} product_count={basket_count} delivery={true} loading={isLoading}>
    <View style={stylesAll.background_block}>
      <Modal visible={openModal} transparent={true} animationType="none">
        <Pressable style={stylesAll.content_modal}>
          <Animated.View
            style={[
              stylesAll.modal_block_placing,
              {
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              },
            ]}
          >
            <Ionicons
              onPress={() => {
                setOpenModal(false);
                router.push("/");
              }}
              size={24}
              style={stylesAll.icon_close}
              name="close"
            />
            <View style={stylesAll.icon_check}>
              <Image
                style={{ width: 20, height: 16 }}
                source={require("../../assets/images/Icon_true.png")}
              />
            </View>
            <View style={{ flexDirection: "column", gap: 12 }}>
              <Text style={stylesAll.promtion_title_placing}>
                Ваш заказ успешно оформлен!
              </Text>
              <Text style={stylesAll.promtion_text_placing}>
                Наш менеджер скоро свяжется с вами
              </Text>
            </View>
            <View style={{width:'100%'}}>
            <Button handle={() => {
                setOpenModal(false);
                router.push("/");
              }} color={colors.feuillet}>Понятно</Button>
            </View>
            {/* <TouchableOpacity
              style={stylesAll.button}
              onPress={() => {
                setOpenModal(false);
                router.push("/");
              }}
            >
              <Text style={stylesAll.button_text}>Понятно</Text>
            </TouchableOpacity> */}
          </Animated.View>
        </Pressable>
      </Modal>
      <Header container={true} back={true}>Оформление заказ</Header>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View style={styles.placing_box_block}>
          <View>
            <Text style={stylesAll.label}>Адрес доставки</Text>
            <Wave handle={local? () => router.push("/navigate/EmptyAddress"): () => router.push('auth/Login')}>
            <Between
              style={styles.placing_box}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
               <AddresIcon/>
                {selectedAddressId ? (
                  <Text style={styles.placeholder_static}>
                    {selectedAddressId}
                  </Text>
                ) : (
                  <Text style={styles.placeholder_static}>
                    Выберите адрес доставки
                  </Text>
                )}
              </View>
            <Arrow/>
            </Between>
            </Wave>
          </View>
          <View>
            <Text style={stylesAll.label}>Время получения</Text>
            <TouchableOpacity
              style={styles.placing_box}
              onPress={() => {
                if (!date1) {
                  setShow(false);
                  setDate1(true);
                }
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View style={stylesAll.cell_box}>
                  <View style={[date1 && stylesAll.active_cell_box]}></View>
                </View>
                <Text style={styles.placeholder_static}>Как можно быстрее</Text>
              </View>
            </TouchableOpacity>
            <Pressable>
              <TouchableOpacity
                style={[styles.placing_box, { marginTop: 10 }]}
                onPress={() => {
                  if (!show) {
                    setShow(true);
                    setDate1(false);
                  }
                }}
              >
                <Flex
              gap={12}
                >
                  <View style={stylesAll.cell_box}>
                    <View style={[show && stylesAll.active_cell_box]}></View>
                  </View>
                  <Text style={styles.placeholder_static}>
                    Выбрать дату и время
                  </Text>
                </Flex>
              </TouchableOpacity>
              {show && (
                <Pressable
                  style={styles.input_box_date}
                  onPress={() => setDatePicker(true)}
                >
                  <CalendarIcons/>
                  <Text style={[styles.placeholder_static, styles.date_text]}>
                    {address.get_date
                      ? new Date(address.get_date).toLocaleString()
                      : new Date().toLocaleString()}
                  </Text>
                </Pressable>
              )}

              {datePicker && (
                <DateTimePickerModal
                  isVisible={datePicker}
                  mode="datetime"
                  onConfirm={(selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      get_date: currentDate.toISOString(),
                    }));
                    setDatePicker(false);
                  }}
                  onCancel={() => setDatePicker(false)}
                />
              )}
            </Pressable>
          </View>
          <View>
            <Text style={[stylesAll.label, show ? { marginTop: 0 } : {}]}>
              Комментарий к заказу( 0-2000)
            </Text>
            <TextInput
              style={[stylesAll.input, styles.input_box_textarea]}
              placeholder="Напишите комментарий"
              placeholderTextColor={"#6B6B6B"}
              multiline
              numberOfLines={10}
              onChangeText={(text) =>
                setAddress((prevAddress) => ({
                  ...prevAddress,
                  comment: text,
                }))
              }
            />
          </View>
          <View style={{ marginTop: 75 }}>
            <Text style={stylesAll.label}>Способ оплаты</Text>
            <TouchableOpacity style={styles.placing_box}>
              <Flex gap={12}>
           <WalletIcon/>
                <Text style={styles.placeholder_static}>Наличными</Text>
              </Flex>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
    </View>
    </ButtonLayouts>
  );
};

const styles = StyleSheet.create({
  placing_box_block :{
    flexDirection: "column",
    gap: 14,
    marginTop: 8,
    paddingHorizontal:16,
  },
  placing_box :{
width:'100%',
height:45,
backgroundColor:colors.phon,
flexDirection:'row',
alignItems:'center',
padding:10,
borderRadius:10
  },
  calendar: {
    width: 24,
    height: 24,
  },
  date_text: {
    marginLeft: 10,
  },
  placeholder_static: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
  },
  input_box_textarea: {
    backgroundColor: colors.phon,
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  input_box: {
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input_box_date: {
    width: "100%",
    height: 45,
    backgroundColor: colors.phon,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  date_picker: {
    height: 45,
    marginTop: 10,
    tintColor: "red",
    marginLeft: -10,
  },
  btn_placing: {
    backgroundColor: "#DC0200",
    marginTop: 15,
  },
  total_text: {
    color: "#FE211F",
  },
  placing_order_bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    minHeight: 180,
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1,
    paddingBottom: 30,
  },
  placing_price_result: {
    fontSize: 18,
    fontWeight: "700",
    color: "#191919",
  },
  placing_price_name: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
  },
});

export default PlacingOrder;
