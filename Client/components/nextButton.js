import { View, Pressable, Text, StyleSheet } from "react-native";

export default NextButton = ({ isEnabled, text, onPress }) => {


    return (
        <Pressable
            style={[styles.container]}
            onPress={() => {
                if (isEnabled) {
                    onPress();
                } else {
                    console.log('button disabled');
                }
            }}>
            <Text style={styles.text}>{text}</Text>
        </Pressable >

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
        // paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 30,
        // textAlign: 'left',
        // backgroundColor: 'red'
    }

});