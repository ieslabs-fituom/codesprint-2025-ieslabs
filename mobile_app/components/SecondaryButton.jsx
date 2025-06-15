import { TouchableOpacity, Text } from "react-native";
import React from "react";

const SecondaryButton = ({ text, onClick = () => {} }) => {
  return (
    <TouchableOpacity
      className="bg-white py-2 px-4 rounded-md"
      onPress={onClick}
    >
      <Text className="text-black text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
