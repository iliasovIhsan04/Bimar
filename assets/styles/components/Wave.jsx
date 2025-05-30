import React, { useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { colors } from "../../styles/components/colors";

const Wave = ({
  disabled,
  background,
  style,
  handle,
  width,
  height,
  children,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const phonValue = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
    Animated.spring(phonValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    Animated.spring(phonValue, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = phonValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.white, colors.phon],
  });
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => (handle ? handle() : "")}
      style={[
        {
          width: width,
          height: height,
        },
        style,
      ]}
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }],
          },
          background && {
            backgroundColor: background ? backgroundColor : undefined,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
export default Wave;
