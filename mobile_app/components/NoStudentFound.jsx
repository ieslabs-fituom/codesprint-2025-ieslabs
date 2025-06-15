import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import ORComponent from "./ORComponent";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import PrimaryButton from "./PrimaryButton";

export default function NostudentFound({
  handleVerifyAgain = () => {},
  nextStudent = () => {},
}) {
  return (
    <View className="flex flex-col justify-center items-center pb-20">
      <MaterialIcon name="cancel" size={100} color={COLORS.RED} />
      <Text className="text-2xl font-bold m-4">NO STUDENT FOUND</Text>
      <PrimaryButton
        text="NEXT STUDENT"
        onClick={() => {
          nextStudent();
        }}
      />
      <ORComponent />
      <PrimaryButton text="VERIFY AGAIN" onClick={() => handleVerifyAgain()} />
    </View>
  );
}
