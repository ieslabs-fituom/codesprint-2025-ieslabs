import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import ORComponent from "./ORComponent";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import PrimaryButton from "./PrimaryButton";

export default function VerificationSuccess({
  verificationResult,
  handleVerifyAgain = () => {},
  nextStudent = () => {},
}) {
  return (
    <View className="flex flex-col justify-center items-center pb-20">
      <FontAwesomeIcon name="user-graduate" size={100} color={COLORS.GREEN} />
      <Text className="text-2xl font-bold m-4">STUDENT VERIFIED</Text>
      <Text className="text-lg font-bold text-gray2 m-1">Index Number</Text>
      <Text className="text-xl font-bold text-gray m-1">
        {verificationResult?.index_no}
      </Text>
      <Text className="text-lg font-bold text-gray2 m-1 mt-4">Name</Text>
      <Text className="text-xl font-bold text-gray m-1 mb-8">
        {verificationResult?.name}
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
