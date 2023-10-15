import { View, TextInput, StyleSheet, Dimensions } from "react-native";

export default InputField = ({ value, placeholder, onChangeTextFunction, secureTextEntry }) => {
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

    return (
        <View style={[
            styles.container, {
                height: height * 0.07,
                width: width * 0.8,
            }]}>
            <TextInput
                style={styles.text}
                onChangeText={text => onChangeTextFunction(text)}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry ? secureTextEntry : false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
    },
    text: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 25,
        textAlign: 'left',
        // backgroundColor: 'red'
    }

});