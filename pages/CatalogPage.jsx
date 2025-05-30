import { colors } from "@/assets/styles/components/colors";
import TextContent from "@/assets/styles/components/TextContent";
import Wave from "@/assets/styles/components/Wave";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import Header from "../components/Main/HeaderAll";
import { View, StyleSheet, Image, Dimensions, Text } from "react-native";
import Loading from "@/assets/ui/Loading";
import { ScrollView } from "react-native";
import { url } from "@/Api";
import { TextInput } from "react-native";
import Search from "../assets/svg/search";
import { stylesAll } from "@/style";

const containerWidth = (Dimensions.get("window").width - 34) / 3 - 5;
const CatalogPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const api = url + "/main/categories";
  const [value, setValue] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(api);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  // if (data.length === 0) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text style={{ fontSize: 18, color: colors.feuillet, fontWeight: "700" }}>
  //         Товара нету!
  //       </Text>
  //     </View>
  //   );
  // }
  return (
    <View style={{ flex: 1 }}>
      <Header empty={true} notification={true} container={true}>
        Каталог
      </Header>
      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 18, color: colors.feuillet, fontWeight: "700" }}
          >
            Товара нету!
          </Text>
        </View>
      ) : (
        <>
          <View style={[styles.header_search]}>
            <View style={styles.catalog_details_search}>
              <Search />
              <TextInput
                style={[stylesAll.input, styles.input_from_catalog]}
                placeholder="Поиск товаров"
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  setFilteredData(
                    data.filter((item) =>
                      item.name.toLowerCase().includes(text.toLowerCase())
                    )
                  );
                }}
              />
            </View>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.shop_block}>
              {filteredData.map((item, id) => (
                <Wave
                  handle={() => router.push(`details/${item.id}`)}
                  key={item.id}
                >
                  <View
                    key={item.id}
                    style={[styles.shop_box, { backgroundColor: item.color }]}
                  >
                    <TextContent
                      fontSize={14}
                      fontWeight={500}
                      color={colors.black}
                      numberOfLines={2}
                    >
                      {item.name}
                    </TextContent>
                    <Image
                      style={styles.image_shop}
                      source={{ uri: item.img }}
                    />
                  </View>
                </Wave>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  header_search: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  catalog_details_search: {
    height: 45,
    backgroundColor: colors.phon,
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  input_from_catalog: {
    flex: 1,
    backgroundColor: colors.phon,
    fontSize: 16,
    fontWeight: "400",
    color: colors.gray,
  },
  box_img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  shop_block: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  shop_box: {
    width: containerWidth,
    height: 104,
    borderRadius: 14,
    position: "relative",
    padding: 10,
  },
  image_shop: {
    width: 70,
    height: 60,
    position: "absolute",
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    borderBottomRightRadius: 16,
  },
  remaining_brend_box: {
    position: "absolute",
    bottom: 0,
    left: 72,
    minWidth: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  breand_box: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CatalogPage;
