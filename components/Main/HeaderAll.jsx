import React  from "react";
import { Platform, StyleSheet, View } from "react-native";
import Flex from "../../assets/styles/components/Flex";
import BackLeft from "../../assets/svg/moreLeft";
import Wave from "../../assets/styles/components/Wave";
import Between from "../../assets/styles/components/Between"
import TextContent from "@/assets/styles/components/TextContent";
import { colors } from "@/assets/styles/components/colors";
import { router, } from "expo-router";
import NotificationsIcon from "../../assets/svg/Notification";

const Header = ({
  iks,
  back,
  container,
  children,
  style,
  reset,
  handleBack,
  notification,
  empty
}) => { 
    return (
    <View
      style={[
        {
          paddingTop: Platform.OS === "ios" ? 60 : 42,
          backgroundColor: colors.white,
          paddingBottom: 12,
        },
        container && {
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      <Between center={"center"} style={{ alignItems: "center" }}>
        <Flex
          style={{
            flex: 1,
            alignItems: "center",
          }}
          gap={20}
        >
          {
            empty && (
              <View style={{width:24, height:24}}></View>
            )
          }
          {back  && (
            <Wave handle={() => router.back() }>
              <BackLeft />
            </Wave>
          )} 
          {
            handleBack && (
              <Wave handle={() => router.push(handleBack) }>
              <BackLeft />
            </Wave>
            )
          }
          <TextContent
            style={{
              flex: 1,
              textAlign:"center"
            }}
            numberOfLines={1}
            fontSize={22}
            fontWeight={600}
            color={colors.black}
          >
            {children}
          </TextContent>
        </Flex>
        <Wave
          style={{
            marginRight: 40,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
        </Wave>
        {iks && (
          <Wave handle={reset}>
            <TextContent fontSize={14} fontWeight={500} color={colors.black}>
              Сбросить
            </TextContent>
          </Wave>
        )}
        {
          notification && (
            <Wave
            handle={() => router.push("navigate/Notifications")}
            style={{ position: "relative" }}
          >
                 <NotificationsIcon />
          </Wave>
          )
        }
      </Between>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Header;
