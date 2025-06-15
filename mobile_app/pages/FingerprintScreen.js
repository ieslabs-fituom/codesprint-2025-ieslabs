import { View, ScrollView, Image, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
import NormalHeader from '../components/NormalHeader';
import BottomNavigation from '../components/BottomNavigation';
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from './../assets/colors/colors';
import PrimaryButton from "./../components/PrimaryButton";
import { DeviceContext } from '../context/BLEdeviceContext';
import { useNavigation } from "@react-navigation/native";
import { ExamContext } from '../context/ExamContext';

const FigerprintScreen = () => {
    const navigation = useNavigation();

    const { indexNumber, selectedExam } = React.useContext(ExamContext);

    const { scanFingerPrint, fingerprintStatus, verificationStatus } = React.useContext(DeviceContext);

    useEffect(() => {
        scanFingerPrint(indexNumber, selectedExam.id)
    }, [])

    useEffect(() => {
        if (verificationStatus != 1) {
            navigation.navigate('Verification')
        }
    }, [verificationStatus])

    return (
        <View className='flex-1'>
            <NormalHeader title='SCAN FINGERPRINT' backPressed={() => { navigation.navigate('Home') }} />
            <ScrollView
                className=""
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 }}
            >
                <View className="flex flex-col justify-center items-center pb-20">
                    <Text className="text-2xl font-bold mb-8">
                        {fingerprintStatus === 1 ? 'Place Your Finger' :
                            fingerprintStatus === 2 ? 'Verifying Student' :
                                fingerprintStatus === 3 ? 'Fingerprint Error' :
                                    fingerprintStatus === 4 ? 'Device not connected' : null}
                    </Text>
                    {fingerprintStatus === 1 ? (
                        <Image source={require('./../assets/ico/scan2.gif')} style={{ width: 150, height: 150, marginBottom: 40 }} />
                    ) : fingerprintStatus === 2 ? (
                        <Image
                            source={require("./../assets/ico/loading2.gif")}
                            className="w-32 h-32 my-10"
                        />
                    ) : fingerprintStatus === 3 ? (
                        <EntypoIcon name="fingerprint" size={100} color={COLORS.RED} style={{ marginBottom: 40 }} />
                    ) : <MaterialIcons name="bluetooth-disabled" size={100} color={COLORS.RED} style={{ marginBottom: 40 }} />}

                    {fingerprintStatus === 2 ?
                        (null)
                        : fingerprintStatus === 3 ?
                            (<PrimaryButton text="Scan Again" onClick={() => { }} />)
                            : null
                    }
                </View>
            </ScrollView >
            <BottomNavigation />
        </View >
    )
}

export default FigerprintScreen

