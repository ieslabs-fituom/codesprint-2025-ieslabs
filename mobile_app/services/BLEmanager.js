import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
export const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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

      console.log("Permissions Granted");

      return (
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      )
    }
  }
}

export const BLEinit = () => {
  console.log('App started');
  requestBluetoothPermission();

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
      console.log('Device connected: ', peripheral);
    },
  );

  let stopDisconnectListener = BleManagerEmitter.addListener(
    'BleManagerDisconnectPeripheral',
    peripheral => {
      console.log('Device disconnected: ', peripheral);
    },
  );

  return () => {
    stopConnectListener.remove();
    stopDisconnectListener.remove();
  }
}






