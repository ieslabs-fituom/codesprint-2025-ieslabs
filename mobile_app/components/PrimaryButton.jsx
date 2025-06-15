import { TouchableOpacity, Text } from "react-native";
import React from "react";

const PrimaryButton = ({ text, onClick = () => {} }) => {
  return (
    <TouchableOpacity
      className="bg-blue py-2 px-4 rounded-md"
      onPress={onClick}
    >
      <Text className="text-white text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
