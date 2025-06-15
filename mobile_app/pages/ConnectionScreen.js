import {
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Text,
    Platform,
    PermissionsAndroid,
    NativeModules,
    NativeEventEmitter
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { COLORS } from './../assets/colors/colors'
import NormalHeader from '../components/NormalHeader';
import BottomNavigation from '../components/BottomNavigation';
import DevicesList from '../components/DevicesList';
import ConnectionCard from '../components/ConnectionCard';
import BluetoothConnectingBottomSheet from '../components/BluetoothConnectingBottomSheet';

import BleManager from 'react-native-ble-manager';
import { DeviceContext } from '../context/BLEdeviceContext';

const ConnectionScreen = () => {
    const { connectedDevice, connectDevice, disconnectDevice, connecting } = React.useContext(DeviceContext);

    const navigation = useNavigation();

    // ------------------- REF USED FOR THE BOTTOM SHEET -------------------
    const refRBSheet = useRef();

    const [selectedDevice, setSelectedDevice] = useState({
        id: '',
        deviceName: '',
        deviceType: ''
    })
    const handleDeviceConnect = (device) => {
        setSelectedDevice(device);
        connectDevice(device);
    }

    useEffect(() => {
        if (connecting == false) {
            setSelectedDevice({
                id: '',
                deviceName: '',
                deviceType: ''
            });
            refRBSheet.current.close();
        } else {
            refRBSheet.current.open();
        }
    }, [connecting]);

    // ------------------- LIST OF NEARBY BLUETOOTH DEVICES -------------------
    const [devices, setDevices] = useState([])

    const getPairedDevices = () => {
        BleManager.getBondedPeripherals([]).then(results => {
            if (results.length === 0) {
                console.log('No connected bluetooth devices');
            } else {
                const newDevices = results
                    .map((peripheral) => {
                        return ({ id: peripheral.id, deviceName: peripheral.name, deviceType: (peripheral.name.includes("CODL")) ? 'CODL Verification Device' : 'Other device' })
                    })
                    .filter((device) => device.deviceName.includes("CODL"))

                setDevices(newDevices)
            }
        });
    }

    useEffect(() => {
        console.log(devices);
    }, [devices]);

    useEffect(() => {
        getPairedDevices();
    }, []);

    return (
        <View className='flex-1'>
            <NormalHeader title='CONNECT DEVICE' backPressed={() => {
                navigation.goBack()
            }} />
            <ScrollView className='flex-1 bg-white py-4 px-3' contentContainerClassName='justify-center items-center'>
                {connectedDevice && <ConnectionCard device={connectedDevice} disconnectFunction={disconnectDevice} />}

                <DevicesList
                    devices={devices}
                    connectFunction={handleDeviceConnect}
                    scanFunction={getPairedDevices} />
            </ScrollView>
            {/* EXECUTE THIS TO SHOW BOTTOM SHEET -> refRBSheet.current.open() */}
            <BluetoothConnectingBottomSheet refRBSheet={refRBSheet} device={selectedDevice} />

            <BottomNavigation />
        </View >
    )
}

export default ConnectionScreen


