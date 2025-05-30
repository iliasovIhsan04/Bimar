import { colors } from "@/assets/styles/components/colors";
import ProfilePage from "@/pages/ProfilePage";
import React from "react";
import { Text, View } from "react-native";

const profile = () => {
  return (
    <View style={{flex:1, backgroundColor:colors.white}}>
      <ProfilePage />
    </View>
  );
};

export default profile;
