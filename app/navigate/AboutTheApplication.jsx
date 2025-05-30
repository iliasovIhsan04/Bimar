import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stylesAll } from "../../style";
import More from "../../assets/svg/more";
import Header from "@/components/Main/HeaderAll";
import { colors } from "@/assets/styles/components/colors";

const AboutTheApplication = () => {
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header handleBack={"(tabs)/profile"}>О приложении</Header>
        <View style={styles.application_block}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            // onPress={() => Linking.openURL('')}
          >
            <Text style={styles.application_text}>
              Правила программы лояльности
            </Text>
            <More />
          </TouchableOpacity>
          <Image
            style={styles.line}
            source={require("../../assets/images/line.png")}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            // onPress={() => Linking.openURL('')}
          >
            <Text style={styles.application_text}>
              Пользовательское соглашение
            </Text>
            <More />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  application_block: {
    width: "100%",
    height: 120,
    backgroundColor: colors.phon,
    borderRadius: 14,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 18,
    marginTop: 8,
  },
  line: {
    width: "95%",
    height: 1,
    marginLeft: "auto",
  },
  application_text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#191919",
  },
});

export default AboutTheApplication;
