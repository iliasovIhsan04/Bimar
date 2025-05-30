import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../../assets/styles/components/colors";

const Loading = ({ color }) => {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 300,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={color ? color : colors.feuillet} />
    </View>
  );
};

export default Loading;