import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";
import Header from '../../components/Main/HeaderAll'
import Wave from "@/assets/styles/components/Wave";
import Loading from "@/assets/ui/Loading";
const PromotionDetails = () => {
  const [harry, setHarry] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${url}/main/card/type/one`
        );
        setHarry(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);
  if (harry.length === 0) {
    return (
  <Loading/>
    );
  }
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header back={true}>Все акции</Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "column", gap: 10, marginBottom: 200, marginTop:8 }}>
            {harry.map((el, id) => (
                <Wave key={id} handle={() => router.push(`/details/PromotionId/${el.id}`)}>
                <View style={styles.prom_img_box}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: el.img }}
                  />
                </View>
                </Wave>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  prom_img_box: {
    width: "100%",
    height:   260,
    borderRadius: 16,
    overflow: "hidden",
  },
  prom_btn: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DC0200",
  },
  prom_btn_text: {
    color: "#DC0200",
    fontSize: 16,
  },
});

export default PromotionDetails;
