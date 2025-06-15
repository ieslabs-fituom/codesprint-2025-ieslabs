import { View, ScrollView, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import NormalHeader from "../components/NormalHeader";
import BottomNavigation from "../components/BottomNavigation";
import Verifying from "../components/Verifying";
import VerificationError from "../components/VerificationError";
import VerificationSuccess from "../components/VerificationSuccess";
import NostudentFound from "../components/NoStudentFound";
import InvalidFingerprint from "../components/InvalidFingerprint";
import { DeviceContext } from "../context/BLEdeviceContext";
import { ExamContext } from "../context/ExamContext";

const VerificationScreen = () => {
    const navigation = useNavigation();

    const { verificationStatus, verificationResult, sendDataToServer, fingerPrintData, resetStates } = React.useContext(DeviceContext);
    const { indexNumber, setIndexNumber, selectedExam } = React.useContext(ExamContext);

    const handleVerifyAgain = () => {
        sendDataToServer(fingerPrintData, indexNumber, selectedExam.id);
    }

    const nextStudent = () => {
        resetStates();
        setIndexNumber('');
        navigation.navigate('Camera');
    }

    return (
        <View className="flex-1">
            <NormalHeader title="STUDENT INFORMATION" backPressed={() => { navigation.navigate('Home') }} />
            <ScrollView
                className=""
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 }}
            >
                {verificationStatus === 1 ? (
                    <Verifying />
                ) : verificationStatus === 2 ? (
                    <VerificationSuccess
                        verificationResult={verificationResult}
                        handleVerifyAgain={handleVerifyAgain}
                        nextStudent={nextStudent} />
                ) : verificationStatus === 3 ? (
                    <NostudentFound handleVerifyAgain={handleVerifyAgain}
                        nextStudent={nextStudent} />
                ) : verificationStatus === 4 ? (
                    <InvalidFingerprint handleVerifyAgain={handleVerifyAgain}
                        nextStudent={nextStudent} />
                ) : verificationStatus === 5 ? (
                    <VerificationError
                        nextStudent={nextStudent} />
                ) : null}
            </ScrollView>
            <BottomNavigation />
        </View>
    );
};

export default VerificationScreen;
