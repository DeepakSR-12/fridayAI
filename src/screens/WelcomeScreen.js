import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 justify-around bg-white">
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(10)}}
          className="text-4xl font-bold text-gray-700 text-center">
          F.R.I.D.A.Y
        </Text>
        <Text
          style={{fontSize: wp(4)}}
          className="font-semibold text-gray-700 text-center tracking-wider">
          Your Everyday AI.
        </Text>
      </View>
      <View className="items-center">
        <Image
          source={require('../../assets/images/welcome.png')}
          style={{width: wp(75), height: wp(75)}}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="p-4 mx-5 bg-emerald-600 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center font-bold text-2xl text-white">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
