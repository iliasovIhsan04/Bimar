import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../../assets/styles/components/colors";

const LoadingFooter = ({ color }) => {
  return (
    <View
      style={{
        minHeight: 100,
      }}
    >
      <ActivityIndicator size="large" color={color ? color : colors.feuillet} />
    </View>
  );
};

export default LoadingFooter;