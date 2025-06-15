import React from "react";
import { View, Text } from "react-native";

const ORComponent = ({}) => {
  return (
    <View className="flex flex-row justify-center items-center my-4">
      <View className="w-16 h-0.5 opacity-40 bg-gray2 rounded-full"></View>
      <Text className="text-gray2 mx-2">OR</Text>
      <View className="w-16 h-0.5 opacity-40 bg-gray2 rounded-full"></View>
    </View>
  );
};

export default ORComponent;
