import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stylesAll } from "../../style";
import { router } from "expo-router";
import Header from "@/components/Main/HeaderAll";
import Column from "@/assets/styles/components/Column";
import { colors } from "@/assets/styles/components/colors";

const ToHelp = () => {
  return (
    <View style={stylesAll.background_block}>
      <View style={stylesAll.container}>
        <Header handleBack={('/(tabs)/profile')}>Помощь</Header>
        <Column gap={10} top={8}>
          <View style={styles.help_box}>
            <View style={{ flexDirection: "column", gap: 6 }}>
              <Text style={styles.help_text1}>Возникли вопросы?</Text>
              <Text style={styles.help_text2}>Наша поддержка проконсультирует Вас по любым возникшим вопросам</Text>
            </View>
            <View style={styles.social_networks_block}>
              <Pressable
                style={styles.social_networks_box}
                onPress={() => Linking.openURL("tel:+996709513509")}
              >
                <Image
                  style={{ width: 34, height: 34 }}
                  source={require("../../assets/images/callPhone.png")}
                />
              </Pressable>
              <Pressable
                style={styles.social_networks_box}
                onPress={() => Linking.openURL("https://wa.me/+996703003995")}
              >
                <Image
                  style={{ width: 34, height: 34 }}
                  source={require("../../assets/images/whatsapp.png")}
                />
              </Pressable>
              <Pressable
                style={styles.social_networks_box}
                onPress={() => Linking.openURL("https://t.me/+996703003995")}
              >
                <Image
                  style={{ width: 28, height: 28 }}
                  source={require("../../assets/images/telegram.png")}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.help_box}>
            <View style={{ flexDirection: "column", gap: 6 }}>
              <Text style={styles.help_text1}>Мы в социальных сетях</Text>
              <Text style={styles.help_text2}>Подписывайтесь на наши социальные сети и будьте в курсе всех новостей</Text>
            </View>
            <View style={styles.social_networks_block}>
              <Pressable
                style={styles.social_networks_box}
                onPress={() =>
                  Linking.openURL("https://www.instagram.com/bai.elim")
                }
              >
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/images/instagram.png")}
                />
              </Pressable>
              <Pressable style={styles.social_networks_box} onPress={() => Linking.openURL('https://www.tiktok.com/@bellavita.kg')}>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/images/tiktok.png")}
                />
              </Pressable>
              <Pressable style={styles.social_networks_box} onPress={() => Linking.openURL('https://youtube.com/@baielim.kg')}>
                <Image
                  style={{ width: 36, height: 26 }}
                  source={require("../../assets/images/youtube.png")}
                />
              </Pressable>
            </View>
          </View>
        </Column>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  help_image_logo: {
    width: 210,
    height: 80,
    margin: "auto",
    marginTop: 50,
    marginBottom: 50,
  },
  help_box: {
    width: "100%",
    minHeight: 180,
    backgroundColor: colors.phon,
    padding: 16,
    borderRadius: 16,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  help_text1: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  help_text2: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B6B6B",
  },
  social_networks_block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },
  social_networks_box: {
    width: 64,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ToHelp;
