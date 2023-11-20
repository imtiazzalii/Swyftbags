import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Field = ({ width = '60%', height = 40, borderRadius = 100, ...props }) => {
  const inputStyle = {
    borderRadius,
    color: "#47ADB8",
    paddingVertical: 5,
    fontWeight: "bold",
    paddingHorizontal: 5,
    borderWidth: 2,
    marginVertical: 5,
    borderColor: "black",
    backgroundColor: "#1D4246",
    width,
    height,
  };

  return (
    <TextInput
      {...props}
      style={inputStyle}
      placeholderTextColor="#47ADB8"
    />
  );
}

export default Field;
