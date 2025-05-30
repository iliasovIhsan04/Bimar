import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "@/Api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddress } from "@/Redux/address/addressesSlice";
import { RootState } from "@/Redux/reducer/store";
import DeleteIcon from "../../assets/svg/deleteIcon";
import Column from "@/assets/styles/components/Column";
import { colors } from "@/assets/styles/components/colors";
import Wave from "@/assets/styles/components/Wave";
import Close from "../../assets/svg/close";
import Header from "../../components/Main/HeaderAll";
import { ScrollView } from "react-native";

const EmptyAddress = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [orderDelete, setOrderDelete] = useState([]);
  const [local, setLocal] = useState(null);

  const addressId = useSelector((state) => state.selectedAddress.selectedId);

  const handleActive = (id, address) => {
    router.push("/navigate/PlacingOrder");
    dispatch(setSelectedAddress({ id, address }));
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("tokenActivation");
    setLocal(token);
  };

  const ordering = async () => {
    try {
      const response = await axios.get(`${url}/core/address/list/`, {
        headers: { Authorization: `Bearer ${local}` },
      });
      setData(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getToken();
    if (local) ordering();
  }, [local]);

  const delite = async (id) => {
    try {
      await axios.delete(`${url}/order/address/delete/${id}`, {
        headers: { Authorization: `Token ${local}` },
      });
      setOrderDelete((prev) => prev.filter((el) => el !== id));
    } catch (error) {
    }
  };

  const datas = data[0]?.active;
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header back={true}>Адрес доставки</Header>
        <View style={{ marginTop: 30 }}>
          <Wave handle={() => router.push("/navigate/NewAddress")}>
            <View style={[stylesAll.button, styles.btn_address]}>
              <Ionicons name="add-outline" size={24} color="#008C44" />
              <Text style={[stylesAll.button_text, { color: colors.feuillet }]}>
                Добавить адрес
              </Text>
            </View>
          </Wave>
          {datas === false ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 20, marginBottom:350 }}>
                {data.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleActive(item.id, item.address)}
                    key={item.id}
                    style={[
                      stylesAll.input,
                      styles.input_box,
                      { marginTop: 10 },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View style={stylesAll.cell_box}>
                        <View>
                          {addressId === item.id && (
                            <View style={styles.line}></View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.placeholder_static} numberOfLines={1}>
                        {item.address}
                      </Text>
                    </View>
                    <Wave
                      handle={async () => {
                        await delite(item.id);
                        ordering();
                      }}
                    >
                      <Close />
                    </Wave>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Column
              gap={30}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 110,
              }}
            >
              <DeleteIcon />
              <Column gap={12}>
                <Text style={stylesAll.history_text_one}>Пока тут пусто</Text>
                <Text style={stylesAll.history_text_two}>
                  Здесь будут храниться ваши адреса
                </Text>
              </Column>
            </Column>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder_static: {
    fontSize: 16,
    fontWeight: "400",
    color: "#191919",
    width: 240,
  },
  line: {
    width: 15,
    height: 15,
    backgroundColor: colors.feuillet,
    borderRadius: 50,
  },
  input_box: {
    backgroundColor: colors.phon,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn_address: {
    width: "100%",
    backgroundColor: "none",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.feuillet,
  },
  empty_address: {
    width: 260,
    height: 235,
  },
});

export default EmptyAddress;
