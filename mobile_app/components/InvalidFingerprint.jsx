import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import PrimaryButton from "./PrimaryButton";
import ORComponent from "./ORComponent";

export default function InvalidFingerprint({
  handleVerifyAgain = () => {},
  nextStudent = () => {},
}) {
  return (
    <View className="flex flex-col justify-center items-center pb-20">
      <MaterialCommunityIcon
        name="shield-alert"
        size={100}
        color={COLORS.RED}
      />
      <Text className="text-2xl font-bold m-4">INVALID FINGERPRINT</Text>
      <Text className="text-lg font-bold text-gray2 m-1">Index Number</Text>
      <Text className="text-xl font-bold text-gray m-1">E2140149853</Text>

      <Text className="text-lg font-bold text-gray2 m-1 mt-4">Name</Text>
      <Text className="text-xl font-bold text-gray m-1 mb-8">
        ABEYSEKARA A.B.C.
      </Text>

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
