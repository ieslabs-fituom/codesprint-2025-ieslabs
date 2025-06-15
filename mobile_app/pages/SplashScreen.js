import { View, Image, Text } from 'react-native'
import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
    return (
        <View className='flex flex-1 bg-blue justify-center items-center'>
            <View className='flex-1 justify-center items-center'>
                <Image source={require('./../assets/img/codl_logo.png')}
                    className='w-[100px] h-[100px] rounded-full' />
                <Text className='text-white text-xl font-bold mt-4 text-center' >EXAMINATION{'\n'}PORTAL</Text>
            </View>
            <View className='flex justify-center items-center absolute bottom-4' >
                <Text className='text-white'>Powered by</Text>
                <Image source={require('./../assets/img/ies_logo.png')}
                    className='w-[125px] h-[41px] object-cover' />
            </View>
        </View>
    )
}

export default SplashScreen