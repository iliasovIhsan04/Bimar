import React from "react";
import { Platform, View } from "react-native";
import Button from "../customs/Button";
import { colors } from "../../assets/styles/components/colors";
import TextContent from "../styles/components/TextContent";
import Column from "../styles/components/Column";
import Between from "../styles/components/Between";
import { stylesAll } from "@/style";

const ButtonLayouts = ({
  container,
  color,
  title,
  loading,
  children,
  disabled,
  handle,
  end_bot,
  product_count,
  total_amount,
  name_product_count,
  all_count_name,
  delivery
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          position: "relative",
        },
        container && {
          paddingHorizontal: 16,
        },
      ]}
    >
      {children}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          paddingVertical: 16,
          paddingBottom: Platform.OS === "ios" ? 26 : 16,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          //   shadowColor: "#474747",
          //   shadowOffset: { width: 0, height: 0 },
          //   shadowOpacity: 0.1,
          //   shadowRadius: 4,
          //   elevation: 3,
          gap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          {end_bot && (
            <View style={stylesAll.basket_line}>
             <Column gap={15} bottom={16}>
             <Between style={{paddingTop:16}}>
              <TextContent fontSize={14} fontWeight={400} color={colors.gray}>{name_product_count}</TextContent>
              <TextContent fontSize={16} fontWeight={500} color={colors.black}>{product_count}</TextContent>
             </Between>
             {
              delivery && (
                <Between>
                <TextContent fontSize={14} fontWeight={400} color={colors.gray}>Доставка:</TextContent>
                <TextContent fontSize={16} fontWeight={500} color={colors.black}>150 сом</TextContent>
               </Between>
              )
             }
             <Between>
             <TextContent fontSize={14} fontWeight={400} color={colors.gray}>{all_count_name}</TextContent>
             <TextContent fontSize={16} fontWeight={500} color={colors.black}>{total_amount} сом</TextContent>
             </Between>
             </Column>
            </View>
          )}
          <View style={{paddingHorizontal:16}}>
          <Button
            handle={handle}
            loading={loading}
            color={color ? color : colors.feuillet}
            disabled={disabled}
          >
            {title ? title : ""}
          </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ButtonLayouts;
