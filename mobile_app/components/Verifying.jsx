import { View, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { COLORS } from "../assets/colors/colors";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Verifying() {
  return (
    <View className="flex flex-col justify-center items-center pb-20">
      <Text className="text-xl font-bold m-3">Verifying Fingerprint</Text>
      {/* <MaterialIcon name="fingerprint" size={150} color={COLORS.BLUE} />
       */}
      <Image
        source={require("./../assets/ico/loading2.gif")}
        className="w-32 h-32 my-10"
      />
      <Text className="text-xl font-bold text-gray m-3">Please Wait</Text>
    </View>
  );
}
