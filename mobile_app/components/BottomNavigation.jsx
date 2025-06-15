import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  ToastAndroid,
} from "react-native";
import React from "react";
import { COLORS } from "./../assets/colors/colors";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { DeviceContext } from "../context/BLEdeviceContext";
import { ExamContext } from "../context/ExamContext";

const BottomNavigation = () => {
  const navigation = useNavigation();

  const { selectedExam, setIndexNumber } = React.useContext(ExamContext);
  const { connectedDevice, resetStates } = React.useContext(DeviceContext);

  return (
    <View className="h-20 bg-blue flex flex-row justify-evenly items-center space-x-6 px-4">
      <TouchableOpacity
        className="flex flex-col justify-center items-center"
        onPress={() => {
          if (selectedExam == null) {
            ToastAndroid.show("Please  select an exam", ToastAndroid.SHORT);
          } else if (connectedDevice == null) {
            ToastAndroid.show("Please connect to a device", ToastAndroid.SHORT);
          } else {
            resetStates();
            setIndexNumber("");
            navigation.navigate("Camera");
          }
        }}
      >
        <EntypoIcon name="fingerprint" size={30} color={COLORS.WHITE} />
        <Text className="text-white text-sm mt-1">VERIFY</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex flex-col justify-center items-center"
        onPress={() => navigation.navigate("Home")}
      >
        <EntypoIcon name="home" size={30} color={COLORS.WHITE} />
        <Text className="text-white text-sm mt-1">HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex flex-col justify-center items-center"
        onPress={() => navigation.navigate("Connection")}
      >
        <FontAwesomeIcon name="bluetooth" size={30} color={COLORS.WHITE} />
        <Text className="text-white text-sm mt-1">CONNECT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
