import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import axios from "axios";
import { url } from "@/Api";
import Header from "@/components/Main/HeaderAll";
import Loading from "@/assets/ui/Loading";
import { colors } from "@/assets/styles/components/colors";
import Column from "@/assets/styles/components/Column";
import TextContent from "@/assets/styles/components/TextContent";
import ImgCart from "../../assets/svg/notImg";
import { ScrollView } from "react-native";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/main/notifications/`);
        setNotifications(response.data);
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

  const cleanText = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header handleBack={"/(tabs)/profile"}>Уведомления</Header>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "column", gap: 10, marginTop: 8, marginBottom:200 }}>
            {notifications.length > 0 ? (
              notifications.map((el, index) => (
                <View key={index} style={styles.notification_box}>
                  <Text style={styles.title}>{cleanText(el.title)}</Text>
                  <Text style={styles.description_text}>
                    {cleanText(el.description)}
                  </Text>
                  <Text style={styles.date_text}>{el.date}</Text>
                </View>
              ))
            ) : (
              <View style={stylesAll.empty_block}>
                <View style={stylesAll.purchase_history}>
                  <View style={stylesAll.history_image_box}>
                    <ImgCart />
                  </View>
                  <Column gap={12}>
                    <TextContent
                      fontSize={22}
                      fontWeight={600}
                      color={colors.black}
                      style={{ textAlign: "center" }}
                    >
                      Нет уведомлений
                    </TextContent>
                    <Text style={stylesAll.history_text_two}>
                      Тут будут появляться ваши новые уведомления
                    </Text>
                  </Column>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notification_box: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.phon,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
    lineHeight: 16,
  },
  description_text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
    lineHeight: 16,
  },
  date_text: {
    fontSize: 12,
    fontWeight: "400",
    color: "#AAAAAA",
  },
  empty_box: {
    alignItems: "center",
    height: "100%",
  },
  empty_text: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
    paddingTop: 380,
  },
});

export default Notifications;
