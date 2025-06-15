import { View, ImageBackground, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";
import SecondaryButton from "./SecondaryButton";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

const ConnectionCard = ({ device, disconnectFunction = () => { } }) => {
  return (
    <ImageBackground
      source={require("./../assets/img/card_back.jpg")} // replace with the path to your image
      className="h-32 px-4 py-4 flex flex-col justify-between items-start rounded-lg"
      imageStyle={{ borderRadius: 10 }}
    >
      <View className="flex flex-col">
        <Text className="text-md  text-white">CONNECTED TO</Text>
        <Text className="text-xl font-bold text-white mb-2">
          {device.deviceName}
        </Text>
      </View>
      <View className="w-full flex flex-row justify-between items-center">
        <SecondaryButton text="DISCONNECT" onClick={() => {disconnectFunction(device)}} />


        {device.deviceType == "CODL Verification Device" ? (
          <View className="flex flex-row items-center">
            <Text className="text-green mr-2">VERIFIED</Text>
            <MaterialIcon name="check-circle" size={24} color={COLORS.GREEN} />
          </View>
        ) : (
          <View className="flex flex-row items-center">
            <Text className="text-red mr-2">UNKNOWN</Text>
            <MaterialCommunityIcon
              name="shield-alert"
              size={24}
              color={COLORS.RED}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default ConnectionCard;
