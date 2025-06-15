import { View, ImageBackground, Image, Text } from "react-native";
import React from "react";

const InsightCard = ({ studentCount, selectedExam }) => {
  return (
    <ImageBackground
      source={require("./../assets/img/card_back.jpg")} // replace with the path to your image
      className="h-32 px-4 flex flex-row justify-evenly items-center rounded-lg"
      imageStyle={{ borderRadius: 10 }}
    >
      {/* <View className="w-full h-full bg-black rounded-lg" /> */}
      <View className="w-1/2 flex flex-col justify-center items-center">
        <Text className="text-white text-4xl font-bold text-center">
          {studentCount}
        </Text>
        <Text className="text-white text-lg text-center">
          Registered Students
        </Text>
      </View>
      <View className="w-1/2 flex flex-col justify-center items-center">
        <Text className="text-white text-2xl font-bold text-center">
          {selectedExam}
        </Text>
        <Text className="text-white text-lg text-center">Selected Exam</Text>
      </View>
    </ImageBackground>
  );
};

export default InsightCard;
