import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {app} from '~/firebase/firebaseConfig';
import {ActivityIndicator, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function AuthListener() {
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const auth = getAuth(app);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate('EventsScreen');
            } else {
                navigation.navigate('index');
            }
            setIsAuthChecked(true);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [auth, navigation]);

    if (!isAuthChecked) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="blue"/>
            </View>
        );
    }

    return null;
}
