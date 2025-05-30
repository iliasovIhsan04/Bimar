import React from "react";
import { View } from "react-native";

const Flex = ({ style, top, left, right, bottom, gap, children }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
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

export default Flex;
