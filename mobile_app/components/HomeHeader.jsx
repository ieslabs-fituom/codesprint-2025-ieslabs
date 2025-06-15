import { View, Image, Text } from "react-native";
import React from "react";

const HomeHeader = () => {
  return (
    <View className="h-20 bg-blue flex flex-row justify-start items-center px-4">
      <Image
        source={require("./../assets/img/uom_logo.png")}
        className="w-[50px] h-[50px] rounded-full"
      />
      <View className="flex flex-col ml-2">
        <Text className="text-white text-lg">CENTER FOR</Text>
        <Text className="text-white text-xl font-bold">
          OPEN AND DISTANCE LEARNING
        </Text>
      </View>
    </View>
  );
};

export default HomeHeader;
