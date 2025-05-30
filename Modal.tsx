import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface ModalDownProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  children?: ReactNode;
}

export default function ModalDown({
  modal = false,
  setModal = () => {},
  children = null,
}: ModalDownProps) {
  const toggleModal = () => {
    setModal(!modal);
  };

  const stylesModal = StyleSheet.create({
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    content: {
      width: "100%",
      justifyContent: "center",
      borderTopStartRadius: 14,
      borderTopEndRadius: 14,
      paddingHorizontal: 16,
      paddingBottom: 40,
      backgroundColor: "#fff",
    },
    clip: {
      alignSelf: "center",
      marginTop: 16,
      width: 74,
      height: 4,
      borderRadius: 10,
      backgroundColor: "#ccc",
    },
  });

  return (
    <Modal
      isVisible={modal}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      onBackdropPress={toggleModal}
      style={stylesModal.modal}
    >
      <View style={stylesModal.content}>
        <View style={stylesModal.clip}></View>
        {children}
      </View>
    </Modal>
  );
}
