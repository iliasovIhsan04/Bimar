import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { stylesAll } from "@/style";

const ProductGiven = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [borderColor, setBorderColor] = useState("#7ED957");
  const [scaleAnimation] = useState(new Animated.Value(1));

  const router = useRouter();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !data) return;
    setScanned(true);
    setBorderColor("#68B936");

    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const productExists = await checkProduct(data);

    if (productExists) {
      router.push(`/details/BarrCodeId/${data}`);
    } else {
      router.push(`/details/BarrCodeId/${data}?notFound=true`);
    }
  };

  const checkProduct = async (data) => {
    return false; 
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Loading...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container_block}>
      <View style={stylesAll.container}>
        <View style={[stylesAll.header, styles.header_given]}>
          <TouchableOpacity
            style={stylesAll.header_back_btn}
            onPress={() => router.push("/")}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/moreLeft.png")}
            />
          </TouchableOpacity>
          <Text style={stylesAll.header_name}>Сканировать</Text>
          <View style={stylesAll.header_back_btn}></View>
        </View>
      </View>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}> 
          <Animated.View
            style={[styles.scannerFrame, { borderColor, transform: [{ scale: scaleAnimation }] }]}
          />
        </View>
  {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Сканировать снова</Text>
          </TouchableOpacity>
    )}
        <View style={styles.instructionBlock}>
          <Text style={styles.instructionText}>Наведите на штрих код товара</Text>
          <Text style={styles.subInstructionText}>Мы найдем этот товар у нас</Text>
        </View>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  header_given: {
    paddingBottom: 10,
  },
  container_block: {
    flex: 1,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  scannerFrame: {
    width: 250,
    height: 200,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  scanAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#68B936",
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionBlock: {
    marginTop: "auto",
    marginBottom: 50,
  },
  instructionText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },
  subInstructionText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "400",
  },
});

export default ProductGiven;
