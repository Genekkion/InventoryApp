import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {SafeAreaProvider } from 'react-native-safe-area-context';

import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='login'>
                    <Stack.Group screenOptions={{ headerShown: true }}>
                        <Stack.Screen name='login' component={LoginPage} />
                        <Stack.Screen name='home' component={HomePage} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer >
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
