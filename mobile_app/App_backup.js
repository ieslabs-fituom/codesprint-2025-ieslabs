import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  NativeModules,
  TouchableOpacity,
  NativeEventEmitter,
  Dimensions,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Buffer } from 'buffer';
import crc from 'crc';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ])

      return (
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      )
    }
  }
}

export default function App() {
  // These UUIDs are hard-coded on ESP32
  const service = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  const RXcharacteristic = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
  const TXcharacteristic = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

  const [message, setMessage] = useState('');
  const [peripheral, setPeripheral] = useState('40:91:51:FC:36:7E');
  const [APIendpoint, setAPIendpoint] = useState('http://192.168.50.164:5000');
  const [isConnected, setIsConnected] = useState(false);

  // app initial start
  useEffect(() => {
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
  }, []);

  const connectToEsp = async () => {
    try {
      // connect to BLE device using MAC address
      await BleManager.connect(peripheral);
      console.log('Connect to ESP32');

      await BleManager.requestMTU(peripheral, 515);
      console.log('Change MTU of connection');

      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(peripheral);
      console.log('Retrieve Services');

      setIsConnected(true);
      setMessage(message => message + 'Connected to ESP32\n');

      // To enable BleManagerDidUpdateValueForCharacteristic listener
      // 18436 buffer size is hardcoded on ESP32
      await BleManager.startNotificationUseBuffer(peripheral, service, TXcharacteristic, 18436);
      console.log('Started Notification Buffer');

      // Add event listener for data received
      BleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleNewData,
      );
      console.log('Added Event Listener');
    } catch (error) {
      console.log(error);
      setMessage(message => message + 'Failed to connect to ESP32\n');
    }
  };

  const disconnectEsp = async () => {
    try {
      // disconnect from BLE device using MAC address
      await BleManager.disconnect(peripheral);
      console.log('Disconnected from ESP32');
      setMessage(message => message + 'Disconnected from ESP32\n');
      setIsConnected(false);

      // remove all event listener for data received
      BleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    } catch (error) {
      console.log(error);
      setMessage(message => message + 'Failed to disconnect ESP32\n');
    }
  };

  const handleNewData = ({ value }) => {
    console.log('Received %d bytes', value.length);
    setMessage(message => message + 'Received ' + value.length + ' Bytes\n');

    const data = Buffer.from(value);
    const dataChecksum = crc.crc32(data.subarray(0, 18432));
    const checksum = data.readUInt32LE(18432);
    console.log('Data checksum: ', dataChecksum);

    if (dataChecksum === checksum) {
      setMessage(message => message + 'Checksum : Pass\n');
      sendDataToServer(data.toString('hex', 0, 18432).toUpperCase());
    } else {
      setMessage(message => message + 'Checksum : Fail\n');
    }

    setMessage(message => message + '- - - - - - - - - - - - -\n');
  };

  const sendCommandToEsp = async () => {
    try {
      // Write 0xAA command to activate FP sequence
      await BleManager.write(peripheral, service, RXcharacteristic, [0xAA]);
      console.log('send command');
      setMessage(message => message + 'Scan Finger\n');
    } catch (error) {
      console.log(error);
      setMessage(message => message + 'Failed to send command\n');
    }
  };

  const sendDataToServer = (data) => {
    try {
      fetch(`${APIendpoint}/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fingerprint: data,
        }),
      });

      console.log('send data to API');
      setMessage(message => message + 'Send Data to Server\n');
    } catch (error) {
      console.log(error);
      setMessage(message => message + 'Failed to send data to API\n');
    }
  };

  return (
    <SafeAreaView style={styles.viewArea}>
      <StatusBar />
      <View style={{ pdadingHorizontal: 10 }}>
        <Text style={styles.heading}>ESP32 Fingerprint Test</Text>

        <View style={styles.container}>
          <Text style={styles.label}>ESP MAC</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setPeripheral(text)}
            value={peripheral}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>API Endpoint</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setAPIendpoint(text)}
            value={APIendpoint}
          />
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={isConnected ? disconnectEsp : connectToEsp}>
              {isConnected ? 'Disconnect ESP32' : 'Connect ESP32'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={sendCommandToEsp}>
            <Text style={styles.buttonText}>Get Fingerprint</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setMessage('')}>
            <Text style={styles.buttonText}>Clear Log</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messageBG}>
          <Text>{message}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewArea: {
    backgroundColor: Colors.lighter,
    flex: 1,
    height: Dimensions.get('window').height,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  messageBG: {
    backgroundColor: '#DDDDDD',
    height: '100%',
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
});
