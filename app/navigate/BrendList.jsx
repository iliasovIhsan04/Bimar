import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import Column from "../../assets/styles/components/Column";
import axios from "axios";
import { colors } from "../../assets/styles/components/colors";
import Wave from "../../assets/styles/components/Wave";
import TextContent from "../../assets/styles/components/TextContent";
import Flex from "../../assets/styles/components/Flex";
import More from "../../assets/svg/more";
import Between from "../../assets/styles/components/Between";
import { router } from "expo-router";
import SubAll from "../../assets/svg/subAll";
import Loading from "@/assets/ui/Loading";
import { url } from "@/Api";
import { stylesAll } from "../../style";
import Back from "../../assets/svg/moreLeft";
import Search from "../../assets/svg/search";
import { ScrollView } from "react-native";

const BrendList = () => {
  const [brendList, setBrendList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    const CategoryBrend = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url + "/brand/");
        setBrendList(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    };
    CategoryBrend();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filteredBrends = brendList.filter((el) =>
    el.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 16 }}
    >
      <View style={[stylesAll.header, styles.header_search]}>
        <Wave handle={() => router.back()}>
          <Back />
        </Wave>
        <View style={styles.catalog_details_search}>
          <Search />
          <TextInput
            style={[stylesAll.input, styles.input_from_catalog]}
            placeholder="Найти бренд"
            value={value}
            onChangeText={setValue}
          />
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Column style={{marginBottom:200}}>
          {/* <Wave handle={() => router.push(`details/brand_${''}`)}>
          <View style={styles.sub_cat_block}>
            <Between center={"center"}>
              <Flex gap={14}>
                <View style={styles.img_block}>
                  <SubAll />
                </View>
                <TextContent fontSize={16} fontWeight={500} color={colors.black}>
                  Все продукты
                </TextContent>
              </Flex>
              <More />
            </Between>
          </View>
        </Wave> */}
          <TextContent
            fontSize={22}
            fontWeight={600}
            color={colors.black}
            style={{ marginTop: 8, marginBottom: 20 }}
          >
            Бренды
          </TextContent>
          {filteredBrends.length === 0 ? (
            <TextContent
              fontSize={16}
              fontWeight={500}
              color={colors.gray}
              style={{ marginTop: 20, textAlign: "center" }}
            >
              Ничего не найдено
            </TextContent>
          ) : (
            filteredBrends.map((el, id) => (
              <Wave
                handle={() => router.push(`details/brand_${el.id}`)}
                key={id}
              >
                <View style={styles.sub_cat_block}>
                  <Between center={"center"}>
                    <Flex gap={14}>
                      <View style={styles.img_block}>
                        <Image
                          style={styles.img_sub_cat}
                          source={{ uri: el.img }}
                        />
                      </View>
                      <TextContent
                        fontSize={16}
                        fontWeight={500}
                        color={colors.black}
                      >
                        {el.name}
                      </TextContent>
                    </Flex>
                    <More />
                  </Between>
                </View>
              </Wave>
            ))
          )}
        </Column>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header_search: {
    paddingBottom: 12,
  },
  catalog_details_search: {
    flex: 1,
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
    color: colors.black,
  },
  img_sub_cat: {
    width: "100%",
    height: "100%",
  },
  img_block: {
    width: 40,
    height: 40,
    backgroundColor: colors.phon,
    borderRadius: 6,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sub_cat_block: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.phon,
  },
});

export default BrendList;
