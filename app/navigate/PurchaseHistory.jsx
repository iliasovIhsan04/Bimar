import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { url } from "@/Api";
import { stylesAll } from "@/style";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Loading from "@/assets/ui/Loading";
import CalendarIcon from "../../assets/svg/calendar";
import { colors } from "@/assets/styles/components/colors";
import Header from "@/components/Main/HeaderAll";
import PurchaseImg from '../../assets/svg/purchaseImage'
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Button from "@/assets/customs/Button";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("tokenActivation");
    if (token) {
      const headers = { Authorization: `Bearer ${token}`};
      const urlWithDates =
        dateFrom && dateTo
          ? `${url}/core/TALASBEK/?date_from=${dateFrom}&date_to=${dateTo}`
          : `${url}/core/TALASBEK/`;
      try {
        const response = await axios.get(urlWithDates, { headers });
        setOrders(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No token found, setting loading to false.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo]);

  if (loading) {
    return <Loading />;
  }

  const handleConfirm = (date) => {
    const isoDate = date.toISOString().split("T")[0];
    isSelectingFromDate ? setDateFrom(isoDate) : setDateTo(isoDate);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header handleBack={"/(tabs)/profile"}>История покупок</Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.length > 0 ? (
            <View style={styles.history_block}>
              <View style={styles.oclock_block}>
                <Pressable
                  style={styles.oclock_box}
                  onPress={() => {
                    setIsSelectingFromDate(true);
                    setDatePickerVisibility(true);
                  }}
                >
                  <View style={styles.dataCalender}>
                    <Text style={styles.from_text}>От</Text>
                    <Text
                      style={[
                        styles.add_calender_text,
                        !dateFrom && styles.placeholderText,
                      ]}
                    >
                      {dateFrom ? `:${dateFrom}` : ""}
                    </Text>
                  </View>
                  <CalendarIcon />
                </Pressable>
                <Pressable
                  style={styles.oclock_box}
                  onPress={() => {
                    setIsSelectingFromDate(false);
                    setDatePickerVisibility(true);
                  }}
                >
                  <View style={styles.dataCalender}>
                    <Text style={styles.from_text}>До</Text>
                    <Text
                      style={[
                        styles.add_calender_text,
                        !dateTo && styles.placeholderText,
                      ]}
                    >
                      {dateTo ? `: ${dateTo}` : ""}
                    </Text>
                  </View>
                  <CalendarIcon />
                </Pressable>
              </View>
             {
              orders?.map((order, index) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  key={index}
                  onPress={() => router.push(`/details/PurchaseId/${order.id}`)}
                >
                  <View style={styles.itemInfo}>
                    <Text style={stylesAll.itemName}>Покупка на сумму</Text>
                    <Text style={stylesAll.itemSum}>{order.sum} сом</Text>
                  </View>
                  <Text style={stylesAll.itemAddress}>
                    {order.address || "Адрес не указан"}
                  </Text>
                  <View style={stylesAll.itemFooter}>
                    <Text style={stylesAll.date_text}>{order.date}</Text>
                    <Text style={stylesAll.bonus}>
                      + {order.total_accrued} баллов
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
             }
            </View>
          ) : (
            <View style={stylesAll.empty_block}>
            <View style={stylesAll.purchase_history}>
              <View style={stylesAll.history_image_box}>
                <PurchaseImg />
              </View>
              <Column gap={12}>
              <TextContent
                fontSize={22}
                fontWeight={600}
                color={colors.black}
                style={{ textAlign: "center" }}
              >
             Вы не сделали ни одной покупки, но это поправимо...
              </TextContent>
              <Text style={stylesAll.history_text_two}>
              Добавьте в избранное всё, что душе угодно, а мы доставим заказ от 150 сом
              </Text>
              </Column>
              <View style={{width:'100%'}}>
              <Button color={colors.feuillet} handle={() => router.push("/(tabs)/catalog")}>Перейти в каталог</Button>
              </View>
            </View>
          </View>
          )}
        </ScrollView>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bonus_minus: {
    color: "red",
  },
  history_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#DC0200",
  },

  purchase_history_text: {
    width: "100%",
    height: 600,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    width: 24,
    height: 24,
  },
  from_text: {
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "600",
  },
  history_block: {
    marginBottom: 150,
  },
  placeholderText: {
    fontSize: 14,
    marginTop: 2,
  },
  add_calender_text: {
    fontSize: 12,
    color: "#191919",
    fontWeight: "400",
  },
  dataCalender: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  oclock_block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom:30
  },
  oclock_box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: containerWidth,
    backgroundColor: colors.phon,
    padding: 10,
    height: 45,
    borderRadius: 10,
    marginTop: 10,
  },
  dateTextInput: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 14,
  },
  historyItem: {
    width: "100%",
    backgroundColor: colors.phon,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "column",
    gap: 12,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PurchaseHistory;
