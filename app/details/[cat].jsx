import { url } from "@/Api";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { useRoute } from "@react-navigation/native";
import ModalDown from "@/Modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Card from "@/assets/customs/Card";
import { colors } from "@/assets/styles/components/colors";
import Button from "../../assets/customs/Button";
import TextContent from "@/assets/styles/components/TextContent";
import Between from "@/assets/styles/components/Between";
import SortIcons from "../../assets/svg/sort";
import FilterIcons from "../../assets/svg/filter";
import Wave from "@/assets/styles/components/Wave";
const containerWidth = (Dimensions.get("window").width - 32) / 2 - 5;
import Back from "../../assets/svg/moreLeft";
import Column from "@/assets/styles/components/Column";
import Search from "../../assets/svg/search";
import Loading from "@/assets/ui/Loading";

const CatalogDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [rangeValue, setRangeValue] = useState([0, 50000]);
  const [appliedRange, setAppliedRange] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [ordering, setOrdering] = useState("");
  const [subCat, setSubCat] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const route = useRoute();
  const { cat = "all" } = route.params || {};

  const fetchData = async (
    min = null,
    max = null,
    order = ordering,
    subCategory = subCat
  ) => {
    try {
      setLoading(true);
      let query;
      if (subCategory) {
        query = `${url}/core/product/list?sub_cat=${subCategory}`;
      } else {
        query = `${url}/core/product/list?category=${cat}`;
      }
      if (min !== null && max !== null) {
        query += `&pricefrom=${min}&priceto=${max}`;
      }
      if (order) {
        query += `&ordering=${order}`;
      }
      const response = await axios.get(query);
      const fetchedData = response.data;
      setData(fetchedData);
      setIsDataAvailable(fetchedData.length > 0);
      if (fetchedData.length > 0) {
        const prices = fetchedData.map((product) => product.price);
        const newMinPrice = Math.min(...prices);
        const newMaxPrice = Math.max(...prices);
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);

        if (!appliedRange) {
          setRangeValue([newMinPrice, newMaxPrice]);
        }
      } else {
        setMinPrice(0);
        setMaxPrice(50000);
        if (!appliedRange) {
          setRangeValue([0, 50000]);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(null, null, ordering, subCat);
  }, [cat, subCat, ordering]);

  const applyFilter = () => {
    setAppliedRange(rangeValue);
    fetchData(rangeValue[0], rangeValue[1], ordering, subCat);
    setModalFilter(false);
  };

  const handleOrdering = (newOrder) => {
    setOrdering(newOrder);
    fetchData(
      appliedRange ? appliedRange[0] : null,
      appliedRange ? appliedRange[1] : null,
      newOrder,
      subCat
    );
    setModal(false); 
  };

  const handleCategorySelection = () => {
    setSubCat(null);
    setSelectedIndex(-1);
    setAppliedRange(null);
    fetchData(null, null, ordering, null);
  };

  const handleTabClick = (selectedId) => {
    setSubCat(selectedId);
    setSelectedIndex(selectedId);
    setAppliedRange(null);
    fetchData(null, null, ordering, selectedId);
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/main/sub-categories/${cat}`);
      setTabs(response.data);
    } catch (error) {
      console.error("Ошибка при получении субкатегорий:", error);
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 3000);
    }
  };
  useEffect(() => {
    fetchSubCategories();
  }, [cat]);

  if (loading) {
    return <Loading />;
  }
  return (
    <View style={[styles.block_cat]}>
      <View
        style={[stylesAll.header, styles.header_search, stylesAll.container]}
      >
        <Wave handle={() => router.back()}>
          <Back />
        </Wave>
        <View style={styles.catalog_details_search}>
          <Search />
          <TextInput
            style={[stylesAll.input, styles.input_from_catalog]}
            placeholder="Поиск товаров"
            value={value}
            onChangeText={setValue}
          />
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        style={[{ width: "100%" }]}
      >
        <View style={styles.catalog_tab_block}>
          <TouchableOpacity
            style={[styles.tab, selectedIndex === -1 && styles.activeTab]}
            onPress={handleCategorySelection}
          >
            <Text
              style={[
                styles.tab_text,
                selectedIndex === -1 && styles.tab_text_active,
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedIndex === tab.id && styles.activeTab]}
              onPress={() => handleTabClick(tab.id)}
            >
              <Text
                style={[
                  styles.tab_text,
                  selectedIndex === tab.id && styles.tab_text_active,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[stylesAll.container]}>
        <ModalDown modal={modal} setModal={setModal}>
          <TextContent
            fontSize={22}
            fontWeight={600}
            color={colors.black}
            top={20}
          >
            Сортировка
          </TextContent>
          <View style={styles.modal_content_sort_block}>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("")}
            >
              <View style={stylesAll.cell_box}>
                <View style={ordering === "" && styles.active_cell_box}></View>
              </View>
              <Text style={stylesAll.cell_text}>По умолчанию</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("-sales")}
            >
              <View style={stylesAll.cell_box}>
                <View
                  style={ordering === "-sales" && styles.active_cell_box}
                ></View>
              </View>
              <Text style={stylesAll.cell_text}>Сначала популярные</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("price")}
            >
              <View style={stylesAll.cell_box}>
                <View
                  style={ordering === "price" && styles.active_cell_box}
                ></View>
              </View>
              <Text style={stylesAll.cell_text}>Сначала дешевые</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("-price")}
            >
              <View style={stylesAll.cell_box}>
                <View
                  style={ordering === "-price" && styles.active_cell_box}
                ></View>
              </View>
              <Text style={stylesAll.cell_text}>Сначала дорогие</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("title")}
            >
              <View style={stylesAll.cell_box}>
                <View
                  style={ordering === "title" && styles.active_cell_box}
                ></View>
              </View>
              <Text style={stylesAll.cell_text}>По алфавиту от А до Я</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_content_sort_item}
              onPress={() => handleOrdering("-title")}
            >
              <View style={stylesAll.cell_box}>
                <View
                  style={ordering === "-title" && styles.active_cell_box}
                ></View>
              </View>
              <Text style={stylesAll.cell_text}>По алфавиту от Я до А</Text>
            </TouchableOpacity>
          </View>
        </ModalDown>
        <ModalDown modal={modalFilter} setModal={setModalFilter}>
          <Text style={styles.sort_title}>Фильтр</Text>
          <View style={styles.filter_block}>
            <View style={styles.filter_tab}>
              <TextContent fontSize={16} fontWeight={400} color={colors.gray2}>
                От
              </TextContent>
              <View style={styles.filter_box}>
                <TextContent
                  fontSize={18}
                  fontWeight={500}
                  color={colors.black}
                >
                  {rangeValue[0]}
                </TextContent>
              </View>
            </View>
            <View style={styles.filter_tab}>
              <TextContent fontSize={16} fontWeight={400} color={colors.gray2}>
                До
              </TextContent>
              <View style={styles.filter_box}>
                <TextContent
                  fontSize={18}
                  fontWeight={500}
                  color={colors.black}
                >
                  {rangeValue[1]}
                </TextContent>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MultiSlider
                values={rangeValue}
                sliderLength={screenWidth - 50}
                onValuesChange={(values) => setRangeValue(values)}
                min={minPrice}
                max={maxPrice}
                step={2}
                allowOverlap={false}
                snapped
                selectedStyle={{ backgroundColor: colors.feuillet }}
                unselectedStyle={{ backgroundColor: colors.feuillet }}
                markerStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: colors.feuillet,
                  borderColor: colors.feuillet,
                }}
              />
            </View>
            <View style={{ width: "100%" }}>
              <Button handle={applyFilter} color={colors.feuillet}>
                Применить
              </Button>
            </View>
          </View>
        </ModalDown>
        <View style={{ width: "100%", marginBottom: 10 }}>
          <Column gap={20} style={{ marginTop: 20 }}>
            {Array.isArray(data) && data.length > 0 && (
              <TextContent fontSize={22} fontWeight={600} color={colors.black}>
                {subCat ? data[0].subcat_name : "Все продукты"}
              </TextContent>
            )}
            <Between center={"center"}>
              <Wave handle={() => setModal(true)}>
                <SortIcons />
              </Wave>
              <TextContent fontSize={14} fontWeight={400} color={colors.gray2} >
                {data?.length} товара
              </TextContent>
              <Wave handle={() => setModalFilter(true)}>
                <FilterIcons />
              </Wave>
            </Between>
          </Column>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[{ width: "100%", height: "100%" }, stylesAll.container]}
      >
        {loading ? (
          <View style={stylesAll.loading_catalog_page}>
            <Loading />
          </View>
        ) : (
          <View style={styles.catalog_block_all}>
            {data.filter((obj) =>
              obj.title.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            ).length === 0 ? (
              <View style={styles.null_product_block}>
                <Text style={stylesAll.barrcode_page_text}>Нет товара!</Text>
              </View>
            ) : (
              data
                .filter((obj) =>
                  obj.title
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase())
                )
                .map((el, id) => (
                  <Card
                    handle={() => router.push(`/details/ProductId/${el.id}`)}
                    id={el.id}
                    key={id}
                    title={el.title}
                    mini_description={el.description}
                    price={el.price}
                    old_price={el.discount_price}
                    percentage={el.discount_percentage}
                    newBlock={el.new}
                    data={data}
                    love={true}
                    img={el.img}
                  />
                ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  footerLoading: {
    width: Dimensions.get("window").width,
    height: 300,
    backgroundColor: "fff",
  },
  catalog_tab_block: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical:10,
    gap:8,
    marginTop:20
  },
  tab: {
    backgroundColor: "#EAEAEA",
    height: 36,
    borderRadius: 50,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.feuillet,
    height: 36,
    borderRadius: 50,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tab_text: {
    color: "#191919",
    fontSize: 14,
    fontWeight: "400",
  },
  tab_text_active: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  sub_cat_box: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 36,
    backgroundColor: colors.phon,
    borderRadius: 50,
  },
  modal: {},
  null_product_block: {
    width: "100%",
    height: 600,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  header_search: {
    gap: 12,
  },
  block_cat: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filter_block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },
  filter_tab: {
    flexDirection: "column",
    gap: 7,
  },
  active_cell_box: {
    width: 15,
    height: 15,
    backgroundColor: colors.feuillet,
    borderRadius: 50,
  },
  filter_box: {
    height: 45,
    backgroundColor: colors.phon,
    borderRadius: 10,
    padding: 10,
    width: containerWidth,
  },
  modal_content_sort_item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modal_content_sort_block: {
    flexDirection: "column",
    gap: 14,
    marginTop: 20,
  },
  catalog_block_all: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    gap:10
  },
  sort_tab: {
    backgroundColor: "#ededed",
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filter_text_tab: {
    color: "#191919",
    fontSize: 14,
    fontWeight: "400",
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
    color: colors.gray,
  },
  header_block_fixed: {
    position: "static",
    paddingBottom: 20,
  },
});

export default CatalogDetails;
