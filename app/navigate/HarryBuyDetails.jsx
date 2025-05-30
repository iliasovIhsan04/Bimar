import { url } from "@/Api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import Loading from "@/assets/ui/Loading";
import Header from "@/components/Main/HeaderAll";
import Card from "@/assets/customs/Card";

const HarryBuyDetails = () => {
  const [harry, setHarry] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${url}/product/list/populars/`
        );
        setHarry(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally{
        setLoading(false)
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
     <Loading/>
    );
  }
  
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
       <Header handleBack={('/(tabs)')}>Успей купить</Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              gap: 10,
              flexDirection: "row",
              marginBottom: 150,
              flexWrap:'wrap',
            }}
          >
            {harry.map((item, id) => (
              <View style={styles.prom_block} key={id}>
              <Card key={id} id={item.id} price={item.price} old_price={item.discount_price} percentage={item.discount_percentage} title={item.title} mini_description={item.description} img={item.img} harryData={harry} handle={() => router.push(`/details/ProductId/${item.id}`)} love={true}/>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  prom_block :{
marginTop:6
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
    width:'100%',
    height: 360,
    borderRadius: 20,
    borderColor: "#DC0200",
    borderWidth: 2,
    padding: 15,
  },
  block_red: {
    width:80,
    height: 80,
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

export default HarryBuyDetails;
