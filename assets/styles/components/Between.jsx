import React from "react";
import { View } from "react-native";

const Between = ({
  style,
  top,
  left,
  right,
  center,
  bottom,
  gap,
  children,
}) => {
  return (
    <View 
      style={[
        {
          flexDirection: "row",
          alignItems: center,
          justifyContent: "space-between",
          marginTop: top,
          marginLeft: left,
          marginRight: right,
          marginBottom: bottom,
          gap: gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Between;
