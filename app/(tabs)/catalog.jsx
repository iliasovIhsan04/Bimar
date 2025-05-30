import { StyleSheet, ScrollView, View } from "react-native";
import { stylesAll } from "../../style";
import { colors } from "@/assets/styles/components/colors";

import CatalogPage from "@/pages/CatalogPage";

export default function CatalogScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <CatalogPage />
    </View>
  );
}

const styles = StyleSheet.create({});
