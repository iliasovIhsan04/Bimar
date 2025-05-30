import React, { useRef } from "react";
import { StyleSheet, View, FlatList, Animated, Dimensions } from "react-native";
import slides from "./Slider";
import OnBoradingItem from "./OnBoradingItem";

const { width } = Dimensions.get("window");

const OnBoarding = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={({ item }) => <OnBoradingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.progressContainer}>
        {slides.map((_, index) => {
          const widthInterpolation = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0, width, 0],
            extrapolate: "clamp",
          });

          return (
            <View key={index} style={styles.lineContainer}>
              <Animated.View
                style={[styles.progressLine, { width: widthInterpolation }]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#68B936",
    position: "relative",
  },
  progressContainer: {
    position: "absolute",
    top: 60,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
  },
  lineContainer: {
    flexDirection: "row",
    width: "31%",
    height: 4,
    backgroundColor: "#CFCFCF",
    justifyContent: "flex-start",
    overflow: "hidden",
    marginBottom: 8,
    borderRadius: 50,
  },
  progressLine: {
    height: 4,
    backgroundColor: "#DC0200",
    width: "100%",
    borderRadius: 50,
  },
});

export default OnBoarding;
