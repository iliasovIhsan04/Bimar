import { colors } from "@/assets/styles/components/colors";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import Loading from "@/assets/ui/Loading";
import { stylesAll } from "@/style";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Back from "../../../assets/svg/backWhite";
import Wave from "@/assets/styles/components/Wave";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { url } from "@/Api";

const PromotionDetailId = () => {
  const [harryId, setHarryId] = useState([]);
  const route = useRoute();
  const { id } = route.params || {};
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            url + `/main/card/${id}`
          );
          setHarryId(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchUserData();
    }
  }, [id]);
  if (!harryId) {
    return <Loading />;
  }
  const cleanText = (text) => {
    return text?.replace(/<\/?[^>]+(>|$)/g, "");
  };
  return (
    <View style={stylesAll.background_block}>
      <View style={styles.promotion_block}>
        <View style={styles.promotion_img_box}>
          <Image style={stylesAll.image_all} source={{ uri: harryId?.img }} />
          <Wave handle={() => router.push("/(tabs)")} style={styles.back}>
            <Back />
          </Wave>
        </View>
        <View style={styles.dateto_box}>
          <TextContent fontSize={16} fontWeight={400} color={colors.white}>
            Акция действует до: {harryId?.dateto}
          </TextContent>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={[stylesAll.container, styles.rout_scroll]}>
            <Column top={24} gap={10}>
              <TextContent fontSize={22} fontWeight={600} color={colors.black}>
                {cleanText(harryId?.title)}
              </TextContent>
              <TextContent fontSize={16} fontWeight={400} color={colors.gray3}>
                {cleanText(harryId?.text)}
              </TextContent>
            </Column>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rout_scroll: {
    marginBottom: 200,
  },
  back: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 42,
    marginLeft: 16,
  },
  dateto_box: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.feuillet,
  },
  promotion_block: {
    flexDirection: "column",
    marginBottom: 200,
  },
  prom_dateto: {
    fontSize: 18,
    fontWeight: "500",
    color: "#DC0200",
  },
  prom_text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#191919",
  },
  promotion_img_box: {
    width: "100%",
    height: 250,
    overflow: "hidden",
    position: "relative",
  },
});

export default PromotionDetailId;
