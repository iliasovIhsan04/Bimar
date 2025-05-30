import React from "react";
import { View } from "react-native";

const Column = ({ style, top, left, right, bottom, gap, children }) => {
  return (
    <View
      style={[
        {
          flexDirection: "column",
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

export default Column;
