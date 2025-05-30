import Main from "@/components/Main/Main";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "@/assets/styles/components/colors";

export default function HomeScreen() {
  return (
    <View style={{flex:1, backgroundColor:colors.phon}}>
        <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
