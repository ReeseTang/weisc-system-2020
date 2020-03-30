import React, {Component} from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput,} from 'react-native';

class Articles extends Component {

    constructor(props){
        super(props);

    }

    render(){

        return(
            <View style={styles.body}>
                <Text>Article Page</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Articles;