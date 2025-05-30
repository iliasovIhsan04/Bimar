import { StyleSheet, ScrollView, View } from "react-native";
import { colors } from "@/assets/styles/components/colors";
import FeaturedProducts from "../navigate/FeaturedProducts";

export default function CatalogScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <FeaturedProducts />
    </View>
  );
}

const styles = StyleSheet.create({});
