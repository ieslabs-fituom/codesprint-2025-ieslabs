import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, TransitionPresets } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { COLORS } from './assets/colors/colors';

import SplashScreen from './pages/SplashScreen';
import HomeScreen from './pages/HomeScreen';
import ConnectionScreen from './pages/ConnectionScreen';
import CameraScreen from './pages/CameraScreen';
import FingerprintScreen from './pages/FingerprintScreen';
import VerificationScreen from './pages/VerificationScreen';

import { DeviceContextProvider, BLEInitialize } from './context/BLEdeviceContext';
import { ExamContextProvider } from './context/ExamContext';

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        BLEInitialize();
    }, [])

    return (
        <ExamContextProvider>
            <DeviceContextProvider>
                <StatusBar backgroundColor={COLORS.BLUE} barStyle="light-content" />
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
                        <Stack.Screen options={{ headerShown: false }} name="Splash" component={SplashScreen} />
                        <Stack.Screen options={{ headerShown: false }} name="Connection" component={ConnectionScreen} />
                        <Stack.Screen options={{ headerShown: false }} name="Camera" component={CameraScreen} key={Math.random()} />
                        <Stack.Screen options={{ headerShown: false }} name="Fingerprint" component={FingerprintScreen} />
                        <Stack.Screen options={{ headerShown: false }} name="Verification" component={VerificationScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </DeviceContextProvider>
        </ExamContextProvider>
    )
} 
