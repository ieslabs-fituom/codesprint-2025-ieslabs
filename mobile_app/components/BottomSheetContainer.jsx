import {} from "react-native";
import React from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { COLORS } from "../assets/colors/colors";

const BottomSheetContainer = ({
  refRBSheet,
  children,
  manualCloseEnabled = false,
}) => {
  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={manualCloseEnabled}
      closeOnPressMask={manualCloseEnabled}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: COLORS.BLUE,
        },
      }}
    >
      {children}
    </RBSheet>
  );
};

export default BottomSheetContainer;
