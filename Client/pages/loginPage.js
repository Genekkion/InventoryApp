import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import InputField from '../components/inputField';
import NextButton from '../components/nextButton';

export default LoginPage = ({ route, navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isInputValid, setIsInputValid] = useState(false);

    const login = async () => {
        fetch('https://inventoryApi1.genekkion.workers.dev/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        }).then(response => {
            if (response.ok) {
                navigation.navigate('home');
            } else {
                console.log(response);
            }
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        const formattedEmail = email.trim().toLowerCase();
        const regex = '^([a-zA-Z0-9\._]+)@(hsec)+.([a-z]+)(. [a-z]+)?';
        const test = formattedEmail.match(regex);
        if (!test) {
            setIsInputValid(false);
            return;
        }
        setIsInputValid(password.length > 5);
    }, [email, password]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/favicon.png')}
                style={styles.image} />
            <View style={{ height: 20 }} />
            <View style={styles.inputContainer}>
                <InputField
                    value={email}
                    placeholder={'Email'}
                    onChangeTextFunction={text => setEmail(text)} />
                <View style={{ height: 20 }} />
                <InputField
                    value={password}
                    placeholder={'Password'}
                    onChangeTextFunction={text => setPassword(text)}
                    secureTextEntry={true} />
                <View style={{ height: 20 }} />
                <NextButton
                    isEnabled={isInputValid}
                    text={'Login'}
                    onPress={() => login()} />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    image: {
        resizeMode: 'contain',
        height: 150,
        width: 150,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    }

})