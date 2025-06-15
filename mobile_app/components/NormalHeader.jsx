import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "./../assets/colors/colors";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const NormalHeader = ({ title, backPressed = () => {} }) => {
  return (
    <View className="h-16 bg-blue flex flex-row justify-start items-center px-4">
      <TouchableOpacity onPress={backPressed}>
        <FontAwesomeIcon name="chevron-left" size={25} color={COLORS.WHITE} />
      </TouchableOpacity>
      <Text className="text-white text-xl font-bold ml-2">{title}</Text>
    </View>
  );
};

export default NormalHeader;
