import { url } from "@/Api";
import Loading from "@/assets/ui/Loading";
import { stylesAll } from "@/style";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HarryBuyDetailsId = () => {
  const [harryId, setHarryId] = useState (null);
  const { id } = useLocalSearchParams();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          url + `/card/one/${id}`
        );
        setHarryId(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  if (!harryId) {
    return (
  <Loading/>
    );
  }
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <View style={[stylesAll.header, stylesAll.header_nav]}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.back()}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Уcловия скидки</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={styles.harry_name_text_red}>Успей купить</Text>
          <Text style={styles.harry_date_text}>{harryId.date}</Text>
        </View>
        <Pressable style={styles.harry_block}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.block_red}>
              <Image
                style={styles.list_img}
                source={require("../../../assets/images/list.png")}
              />
              <Text style={styles.percentage_text}>{harryId.percentage}</Text>
              <Text style={styles.prom_price}>{harryId.prom_price}</Text>
              <Text style={styles.price_text}>{harryId.price}</Text>
              <View style={styles.line_price}></View>
            </View>
            <View style={styles.title_text_box}>
              <Text style={styles.harry_title} numberOfLines={2}>
                {harryId.title}
              </Text>
              <Text style={styles.harry_net_text}>{harryId.net}</Text>
              <Text style={styles.harry_where_text}>{harryId.where}</Text>
            </View>
          </View>
          <View style={styles.prom_img_box}>
            <Image style={styles.prom_img} source={{ uri: harryId.img }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.date_box}>
              <Text style={styles.date_text}>{harryId.date}</Text>
              <View style={styles.data_right_rotate}></View>
              <View style={styles.data_left_rotate}></View>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  harry_name_text_red: {
    fontSize: 18,
    fontWeight: "500",
    color: "000",
  },
  harry_date_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgb(220, 2, 0)",
  },
  data_right_rotate: {
    width: 21.5,
    height: 21.5,
    backgroundColor: "#fff",
    position: "absolute",
    right: -11,
    transform: [{ rotate: "45deg" }],
  },
  data_left_rotate: {
    width: 21.5,
    height: 21.5,
    backgroundColor: "#fff",
    position: "absolute",
    left: -11,
    transform: [{ rotate: "45deg" }],
  },
  date_text: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  date_box: {
    width: 150,
    height: 30,
    backgroundColor: "#68b936",
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: 0,
  },
  prom_img_box: {
    width: 210,
    height: 180,
    margin: "auto",
    marginTop: 10,
  },
  prom_img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  line_price: {
    width: 25,
    height: 1,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 18,
    margin: "auto",
    transform: [{ rotate: "160deg" }],
  },
  percentage_text: {
    fontSize: 10,
    color: "#FFFFFF",
    position: "absolute",
    top: 0,
    right: 9,
  },
  list_img: {
    width: 41,
    height: 23,
    position: "absolute",
    top: -5,
    right: 2,
  },
  price_text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  harry_block: {
    width: "100%",
    height: 360,
    borderRadius: 20,
    borderColor: "#DC0200",
    borderWidth: 2,
    padding: 15,
  },
  block_red: {
    width: 81,
    height: 81,
    borderRadius: 50,
    backgroundColor: "#fe211f",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  title_text_box: {
    width: "70%",
  },
  harry_title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#191919",
    overflow: "hidden",
    marginBottom: 0,
    lineHeight: 16,
  },
  harry_net_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  harry_where_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#68B936",
  },
  prom_text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#191919",
  },
  prom_price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default HarryBuyDetailsId;
