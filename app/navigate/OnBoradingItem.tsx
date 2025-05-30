import { stylesAll } from "@/style";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const OnBoradingItem = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.to_come_in_box}>
        <View style={{ flexDirection: "column", gap: 16 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
      <View style={styles.imageWrapper}>
        <Image source={item.img} style={styles.image} />
      </View>
      {item.btn_text && (
        <TouchableOpacity
          onPress={() => router.push("/auth/Registration")}
          style={[stylesAll.button, styles.btn_onboard]}
        >
          <Text style={stylesAll.buttonText}>{item.btn_text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 70,
  },
  title: {
    color: "#191919",
    fontWeight: "700",
    fontSize: 24,
    textAlign: "center",
    lineHeight: 26,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
  },
  imageWrapper: {
    position: "absolute",
    width: "75%",
    height: "60%",
    bottom: 0,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
  },
  to_come_in_box: {
    width: "100%",
    height: "30%",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    position: "absolute",
    top: 0,
  },
  btn_onboard: {
    backgroundColor: "#DC0200",
    width: "90%",
    position: "absolute",
    bottom: 30,
  },
});

export default OnBoradingItem;
