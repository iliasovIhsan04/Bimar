import React from "react";
import { Text } from "react-native";

const TextContent = ({
  flex,
  style,
  top,
  left,
  right,
  bottom,
  fontSize,
  fontWeight,
  children,
  color,
  center,
  numberOfLines,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={[
        {
          marginTop: top,
          marginLeft: left,
          marginRight: right,
          marginBottom: bottom,
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontFamily: "Lato",
          color: color,
          textAlign: center,
        },
        flex && {
          flex: 1,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default TextContent;
