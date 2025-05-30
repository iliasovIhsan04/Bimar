import { url } from "@/Api";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Wrapper from "../../assets/styles/components/Wrapper";
import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import Flex from "@/assets/styles/components/Flex";
import Morees from "../../assets/svg/more";
import Column from "@/assets/styles/components/Column";
import FavoriteWhite from "../../assets/svg/faviriteWhite";

const SalesHits = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/main/card/type/one`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Wrapper padding={[100, 20]} style={{ paddingHorizontal: 0 }} bottom={true}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <TextContent fontSize={20} fontWeight={600} color={colors.b_black}>
          Хиты продаж
        </TextContent>
        <Wave
          style={{ flexDirection: "row", alignItems: "center" }}
          handle={() => router.push("/navigate/PromotionDetails")}
        >
          <Flex>
            <TextContent fontSize={16} fontFamily={400} color={colors.feuillet}>
              Все
            </TextContent>
            <Morees />
          </Flex>
        </Wave>
      </View>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginTop: 10,
              marginHorizontal: 16,
            }}
          >
            {data?.map((el, id) => (
              <Pressable
                key={el.id}
                style={styles.promotion_box}
                onPress={() => router.push(`/details/PromotionId/${el.id}`)}
              >
                <View style={styles.position_favorite_box}>
                  <View style={styles.position_favorite}>
                    <Wave>
                      <FavoriteWhite />
                    </Wave>
                  </View>
                  <Image
                    style={styles.promotion_img_box}
                    source={{ uri: el.img }}
                  />
                </View>
                <Column
                  gap={4}
                  style={{
                    paddingHorizontal: 8,
                    paddingTop: 8,
                    paddingBottom: 12,
                  }}
                >
                  <Flex gap={4}>
                    <TextContent
                      fontSize={20}
                      fontWeight={700}
                      color={colors.feuillet}
                    >
                      380 с
                    </TextContent>
                    <TextContent
                      fontSize={14}
                      fontWeight={600}
                      color={colors.b_gray}
                    >
                      шт
                    </TextContent>
                  </Flex>
                  <TextContent
                    color={colors.b_black}
                    fontSize={16}
                    fontWeight={600}
                  >
                    Пахлава
                  </TextContent>
                </Column>
              </Pressable>
            ))}
          </View>
        }
      </ScrollView>
    </Wrapper>
  );
};
const styles = StyleSheet.create({
  position_favorite_box: {
    position: "relative",
  },
  position_favorite: {
    width: 40,
    height: 40,
    backgroundColor: "#C4C4C4CC",
    position: "absolute",
    top: 4,
    right: 4,
    borderRadius: 50,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  promotion_img_box: {
    width: "100%",
    height: 173,
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  promotion_box: {
    width: 175,
    minHeight: 245,
    borderRadius: 16,
    backgroundColor: colors.phon,
  },
});

export default SalesHits;
