import React, { createContext, useState, useEffect } from "react";
import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Buffer } from 'buffer';
import crc from 'crc';

const DeviceContext = createContext();

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// These UUIDs are hard-coded on ESP32
const service = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const RXcharacteristic = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
const TXcharacteristic = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

const requestBluetoothPermission = async () => {
  if (Platform.OS === 'ios') {
    return true
  }
  if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
    const apiLevel = parseInt(Platform.Version.toString(), 10)

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ])

      return (
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      )
    }
  }
}

const BLEInitialize = () => {
  requestBluetoothPermission();
  console.log("Permissions Requested");

  // start Bluetooth
  BleManager.enableBluetooth().then(() => {
    console.log('Bluetooth is turned on!');
  });

  // stat BLE-manager
  BleManager.start({ showAlert: false }).then(() => {
    console.log('BleManager initialized');
  });

  let stopConnectListener = BleManagerEmitter.addListener(
    'BleManagerConnectPeripheral',
    peripheral => {
      console.log('EventListener-Connected: ', peripheral);
    },
  );

  let stopDisconnectListener = BleManagerEmitter.addListener(
    'BleManagerDisconnectPeripheral',
    peripheral => {
      console.log('EventListener-Disconnected: ', peripheral);
    },
  );

  return () => {
    stopConnectListener.remove();
    stopDisconnectListener.remove();
  }
}

const DeviceContextProvider = ({ children }) => {

  const [connectedDevice, setConnectedDevice] = useState(null)

  // Following states are used to show bottom sheets when connecting to a device
  const [connecting, setConnecting] = useState(false)

  // Following states are used to show fingerprint status and data collected through BLE
  const [fingerPrintData, setFingerPrintData] = useState(null);
  const [fingerprintStatus, setFingerprintStatus] = useState(1); // 1 for scanning, 2 for recived and sending data to server, 3 for error, 4 - device not connected

  const [verificationStatus, setVerificationStatus] = useState(1); // 1 for verifying, 2 for success, 3 for no student found, 4 for invalid fingerprint for the selected student, 5 for error
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    console.log("Context State:", connectedDevice);
  }, [connectedDevice]);

  const connectDevice = async (device) => {
    try {
      setConnecting(true);
      // connect to BLE device using MAC address
      await BleManager.connect(device.id);
      console.log('Connected');

      await BleManager.requestMTU(device.id, 515);
      console.log('Change MTU of connection');

      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(device.id);
      console.log('Retrieve Services');

      setConnectedDevice(device);
      setConnecting(false);
    } catch (error) {
      setConnecting(false);
      ToastAndroid.show('Failed to connect to device', ToastAndroid.SHORT);
      console.log(error);
    }
  }

  const disconnectDevice = async (device) => {
    try {
      // disconnect from BLE device using MAC address
      await BleManager.disconnect(device.id);
      console.log('Disconnected');

      // remove all event listener for data received
      BleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );

      setConnectedDevice(null);
    } catch (error) {
      console.log(error);
    }
  };

  const scanFingerPrint = async (indexNumber, examNumber) => {
    if (!connectedDevice) {
      //throw new Error({ code: 1, message: 'Device not connected' });
      setFingerprintStatus(4);
      return;
    }

    // To enable BleManagerDidUpdateValueForCharacteristic listener
    // 18436 buffer size is hardcoded on ESP32
    await BleManager.startNotificationUseBuffer(connectedDevice.id, service, TXcharacteristic, 18436);
    console.log('Started Notification Buffer');

    // Add event listener for data received
    BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      (value) => handleNewData(value, indexNumber, examNumber)
    );
    console.log('Added Event Listener');

    await BleManager.write(connectedDevice.id, service, RXcharacteristic, [0xAA]);
    console.log('send command');
  }

  const removeEventListener = () => {
    // remove all event listener for data received
    BleManagerEmitter.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic',
    );
  };

  const handleNewData = ({ value }, indexNumber, examNumber) => {
    console.log('Received %d bytes', value.length);

    const data = Buffer.from(value);
    const dataChecksum = crc.crc32(data.subarray(0, 18432));
    const checksum = data.readUInt32LE(18432);
    console.log('Data checksum: ', dataChecksum);

    if (dataChecksum === checksum) {
      console.log('Checksum Pass');
      setFingerprintStatus(2);
      setFingerPrintData(data.toString('hex', 0, 18432).toUpperCase())
      sendDataToServer(data.toString('hex', 0, 18432).toUpperCase(), indexNumber, examNumber);
    } else {
      console.log('Checksum Fail');
      setFingerprintStatus(3);
    }
  };

  const sendDataToServer = async (data, indexNumber, examNumber) => {
    setVerificationStatus(1);
    try {
      const response = await fetch(`http://192.168.8.100:5000/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index_no: indexNumber,
          fingerprint_byte_array: data,
          exam_id: examNumber
        }),
      });

      const result = await response.json();
      console.log("API response", result);
      console.log("API response status", response.status)

      // Validate verification result and set verificationState accordingly
      switch (response.status) {
        case 200:
          setVerificationStatus(2);
          setVerificationResult(result);
          break;
        case 404:
          // No student found
          setVerificationStatus(3);
          break;
        case 405:
          // Invalid fingerprint for the selected student
          setVerificationStatus(4);
          break;
        default:
          // setVerificationStatus(2);
          // setVerificationResult(result);
          setVerificationStatus(5);
          ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
          break;
      }
    } catch (error) {
      console.log(error);
      setVerificationStatus(5);
      ToastAndroid.show('Failed to send data to server', ToastAndroid.SHORT);
    }

    removeEventListener();

  };

  const resetStates = () => {
    setFingerPrintData(null);
    setFingerprintStatus(1);
    setVerificationStatus(1);
    setVerificationResult(null);
  }


  return (
    <DeviceContext.Provider
      value={{
        connectedDevice,
        connecting,
        BleManagerEmitter,
        BLEInitialize,
        connectDevice,
        disconnectDevice,
        scanFingerPrint,
        fingerprintStatus,
        fingerPrintData,
        setFingerPrintData,
        verificationStatus,
        setVerificationStatus,
        verificationResult,
        resetStates,
        sendDataToServer,
        removeEventListener
      }}>
      {children}
    </DeviceContext.Provider>
  )
}

export { DeviceContext, DeviceContextProvider, BLEInitialize }