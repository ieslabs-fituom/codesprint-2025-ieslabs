import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import PrimaryButton from "./PrimaryButton";

export default function VerificationError({ nextStudent = () => {} }) {
  return (
    <View className="flex flex-col justify-center items-center pb-20">
      <Text className="text-xl font-bold m-3">Something Went Wrong</Text>
      <MaterialCommunityIcon
        name="access-point-network-off"
        size={150}
        color={COLORS.RED}
      />
      <View className="mt-8">
        <PrimaryButton
          text="NEXT STUDENT"
          onClick={() => {
            nextStudent();
          }}
        />
      </View>
    </View>
  );
}
