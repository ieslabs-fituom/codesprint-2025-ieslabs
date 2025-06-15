import { View, TouchableOpacity, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import ListCard from "./ListCard";
import { COLORS } from "../assets/colors/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ExamsList = ({
  devices,
  scanFunction = () => {},
  connectFunction = () => {},
}) => {
  const handleDeviceSelect = (device) => {
    connectFunction(device);
  };

  return (
    <View className="px-2 mb-12">
      <View className="mt-4 flex flex-row justify-between items-center">
        <Text className="text-xl font-bold text-blue">Paired Devices</Text>
        <TouchableOpacity className="" onPress={scanFunction}>
          <MaterialIcons name="refresh" size={24} color={COLORS.BLUE} />
        </TouchableOpacity>
      </View>

      {devices.map((device) => (
        <ListCard
          key={device.id}
          leftIcon={
            device.deviceType == "CODL Verification Device"
              ? "check-circle"
              : device.deviceType == "Phone/Computer"
              ? "mobile"
              : "headphones"
          }
          rightIcon={"chevron-right"}
          title={device.deviceName}
          subtitile={device.deviceType}
          onClick={() => handleDeviceSelect(device)}
        />
      ))}
    </View>
  );
};

export default ExamsList;
