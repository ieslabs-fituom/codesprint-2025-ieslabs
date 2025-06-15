import { View, Image, Text } from "react-native";
import React from "react";
import BottomSheetContainer from "./BottomSheetContainer";

const BluetoothConnectingBottomSheet = ({ refRBSheet, device }) => {
  return (
    <BottomSheetContainer refRBSheet={refRBSheet} manualCloseEnabled={false}>
      <View className="flex flex-1 flex-col justify-center items-center">
        <Image
          source={require("./../assets/ico/loading.gif")}
          className="w-10 h-10"
        />
        <Text className="text-gray2 text-center mt-4 text-lg">CONNECTING</Text>
        <Text className="text-white text-center mt-6 font-bold text-4xl">
          {device.deviceName}
        </Text>
      </View>
    </BottomSheetContainer>
  );
};

export default BluetoothConnectingBottomSheet;
