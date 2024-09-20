import '~/global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Theme, ThemeProvider} from '@react-navigation/native';
import {SplashScreen, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {PortalHost} from '@rn-primitives/portal';
import {setAndroidNavigationBar} from '~/lib/android-navigation-bar';
import Toastable from "react-native-toastable";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const LIGHT_THEME: Theme = {
    dark: false,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    dark: true,
    colors: NAV_THEME.dark,
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const {colorScheme, setColorScheme, isDarkColorScheme} = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const theme = await AsyncStorage.getItem('theme');
            if (Platform.OS === 'web') {
                // Adds the background color to the html element to prevent white background on overscroll.
                document.documentElement.classList.add('bg-background');
            }
            if (!theme) {
                await AsyncStorage.setItem('theme', colorScheme);
                setIsColorSchemeLoaded(true);
                return;
            }
            const colorTheme = theme === 'dark' ? 'dark' : 'light';
            if (colorTheme !== colorScheme) {
                setColorScheme(colorTheme);
                await setAndroidNavigationBar(colorTheme);
                setIsColorSchemeLoaded(true);
                return;
            }
            await setAndroidNavigationBar(colorTheme);
            setIsColorSchemeLoaded(true);
        })().finally(() => {
            SplashScreen.hideAsync();
        });
    }, []);

    if (!isColorSchemeLoaded) {
        return null;
    }

    const {top} = useSafeAreaInsets();

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
            <Stack>
                <Stack.Screen name='AuthListener' options={{headerShown: false}}/>
                <Stack.Screen name='index' options={{headerShown: false}}/>
                <Stack.Screen name='SignUpScreen' options={{headerShown: false}}/>
                <Stack.Screen name='EventsScreen' options={{headerShown: false}}/>
                <Stack.Screen name='CreateEventScreen' options={{headerShown: false}}/>
            </Stack>
            <PortalHost/>
            <Toastable
                statusMap={{
                    success: 'green',
                    danger: 'red',
                    warning: 'yellow',
                    info: 'blue'
                }}
                offset={top}
            />
        </ThemeProvider>
    );
}
