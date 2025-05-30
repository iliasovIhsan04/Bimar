import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import Wave from "../../assets/styles/components/Wave";
import { router, useFocusEffect } from "expo-router";
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import { url } from "@/Api";
import { useCondition } from "@/context/FavoriteContext";

const HurryUpToBuy = () => {
  const {
    favoriteHarry,
    setFavoriteHarry,
    favoriteProductId,
    setFavoriteProductId,
    favoriteItemsLocal,
    setFavoriteItemsLocal,
  } = useCondition();
  const [data, setData] = useState([]);
  const api = url + `/card/type/top`;
  const [loading, setLoading] = useState(false);
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(api);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (favoriteHarry || favoriteProductId || favoriteItemsLocal) {
        fetchUserData();
        setFavoriteHarry(false);
        setFavoriteProductId(false);
        setFavoriteItemsLocal(false);
      }
    }, [favoriteHarry, favoriteProductId, favoriteItemsLocal])
  );

  return (
    <View style={{ marginTop: 30 }}>
      {loading ? (
        <TextContent>Loading...</TextContent>
      ) : (
        <>
          <View
            style={{
              marginBottom: 10,
              paddingHorizontal: 16,
            }}
          >
            <TextContent fontSize={20} fontWeight={600} color={colors.black}>
              Топ продажа
            </TextContent>
          </View>
          <ScrollView
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                gap: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 16,
              }}
            >
              {data.map((item) => (
                <>
                  <Wave handle={() => router.push(`/details/PromotionId/${item.id}`)}>
                      <Image
                        style={styles.list_img}
                        source={{ uri: item.img }}
                      />
                  </Wave>
                </>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list_img: {
    width: 328,
    height: 150,
    borderRadius: 10,
  },
});

export default HurryUpToBuy;
