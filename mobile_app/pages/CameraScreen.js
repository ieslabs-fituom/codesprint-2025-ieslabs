import { View, ScrollView, Text, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import NormalHeader from '../components/NormalHeader';
import BottomNavigation from '../components/BottomNavigation';
import PrimaryButton from '../components/PrimaryButton';
import ORComponent from '../components/ORComponent';
import IndexNumberBottomSheet from '../components/IndexNumberBottomSheet';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ExamContext } from '../context/ExamContext';
import { DeviceContext } from '../context/BLEdeviceContext';

const CameraScreen = () => {
    const navigation = useNavigation();

    const { indexNumber, setIndexNumber } = React.useContext(ExamContext);
    const [localIndexNumber, setLocalIndexNumber] = useState('');
    const { resetStates } = React.useContext(DeviceContext);
    const [hasPermission, setHasPermission] = useState(null);
    const [isScanned, setIsScanned] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const refRBSheet = useRef();

    useFocusEffect(
        React.useCallback(() => {
            console.log('Camera Screen Mounted');
            resetStates();
            setIndexNumber('');
            setCameraReady(true);
            (async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            })();

            return () => {
                console.log('Camera Screen Unmounted');
                setCameraReady(false);
            };
        }, [])
    );

    useEffect(() => {
        if (hasPermission == true) {
            console.log('Camera permission:', hasPermission);
        }
    }, [hasPermission])

    useEffect(() => {
        console.log('Local Index Number:', localIndexNumber);
        if (localIndexNumber.length > 0 && localIndexNumber.trim() != '') {
            handleBarCodeScanned({ data: localIndexNumber })
        }
    }, [localIndexNumber])

    const handleBarCodeScanned = ({ data }) => {
        console.log('Scanned Data:', data);

        const regex = /^E\d{7}$/;

        if(regex.test(data)) {
            setIndexNumber(data);
            navigation.navigate("Fingerprint")
        } else {
            
            ToastAndroid.show('Invalid Index Number', ToastAndroid.SHORT);
        }
    };

    return (
        <View className='flex-1'>
            <NormalHeader title='STUDENT INDEX NUMBER' backPressed={() => { navigation.navigate("Home") }} />
            <ScrollView
                className=""
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 }}
            >
                <View className='flex flex-col justify-center items-center pb-20'>
                    <Text className='text-blue text-lg font-bold mb-4'>Scan the QR code on your student ID</Text>
                    <View className='w-64 h-64 rounded-xl overflow-hidden'>
                        {cameraReady && (
                            <Camera
                                className='w-full h-full'
                                type={Camera.Constants.Type.back}
                                onBarCodeScanned={handleBarCodeScanned}
                            />
                        )}
                    </View>
                    <ORComponent />
                    <PrimaryButton text='Enter Index Number' onClick={() => { refRBSheet.current.open() }} />
                </View>
            </ScrollView>
            <BottomNavigation />
            <IndexNumberBottomSheet
                refRBSheet={refRBSheet}
                onClick={(indexNumber) => {
                    setLocalIndexNumber(indexNumber);
                    refRBSheet.current.close();
                }} />
        </View>
    )
}

export default CameraScreen

