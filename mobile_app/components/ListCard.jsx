import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const ListCard = ({
  leftIcon,
  title,
  subtitile,
  rightIcon,
  onClick = () => {},
}) => {
  return (
    <TouchableOpacity
      className="h-12 pb-1 bg-white border-b border-gray2 flex flex-row justify-between items-center mt-4"
      onPress={onClick}
    >
      <View className="flex-row justify-between items-center">
        <FontAwesomeIcon name={leftIcon} size={30} color={COLORS.BLUE} />
        <View className="flex flex-col ml-4">
          <Text className="text-black text-lg font-bold">{title}</Text>
          <Text className="text-gray text-md">{subtitile}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onClick}>
        <FontAwesomeIcon
          name={rightIcon}
          size={30}
          color={COLORS.BLUE}
          className="ml-auto"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ListCard;
