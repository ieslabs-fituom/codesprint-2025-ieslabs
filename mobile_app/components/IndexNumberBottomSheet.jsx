import { View, TextInput, Text } from "react-native";
import React, { useState } from "react";
import BottomSheetContainer from "./BottomSheetContainer";
import SecondaryButton from "./SecondaryButton";
import { COLORS } from "../assets/colors/colors";

const IndexNumberBottomSheet = ({ refRBSheet, onClick }) => {
  const [indexNumber, setIndexNumber] = useState("");

  const handleButtonClick = () => {
    onClick(indexNumber);
    setIndexNumber("");
  };

  return (
    <BottomSheetContainer refRBSheet={refRBSheet} manualCloseEnabled={true}>
      <View className="flex flex-1 flex-col justify-center items-center">
        <Text className="text-white text-center mt-4 text-lg">
          ENTER INDEX NUMBER
        </Text>
        <TextInput
          className="w-60 h-10 text-center text-lg bg-white rounded-md mt-4 px-4 mb-8"
          value={indexNumber}
          onChangeText={(e) => setIndexNumber(e)}
          placeholder="Index Number"
        />
        <SecondaryButton
          text="CONTINUE VERIFICATION"
          onClick={handleButtonClick}
        />
      </View>
    </BottomSheetContainer>
  );
};

export default IndexNumberBottomSheet;
