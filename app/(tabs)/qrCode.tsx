import { colors } from "@/assets/styles/components/colors";
import QrCode from "@/components/Main/QrCode";
import React from "react";
import { View } from "react-native";

const qrCod = () => {
  return (
    <View style={{backgroundColor:colors.white,flex:1 }}>
      <QrCode />
    </View>
  );
};

export default qrCod;

