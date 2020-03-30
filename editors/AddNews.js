import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Keyboard, Platform, Alert,
     ScrollView, Picker, Modal, ActivityIndicator, FlatList, TouchableOpacity, DatePickerAndroid } from 'react-native';
import { Button, Input, Icon, Divider } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Storage } from 'aws-amplify';


export default class AddNews extends Component {
    constructor(props){
        super(props);
        this.state = {
            region: 'Africa',
            country: '',
            title: '',
            pDate: '',
            source: '',
            detail: '',
            media1: '',
            media2: '',
            e_class: '',
            e_name: '',
            reference: '',
            errorEnabled: false,
            textfield1: false,
            textfield2: false,
            textfield3: false,
            textfield4: false,
            textfield5: false,
            textfield6: false,
            textfield7: false,
            textfield8: false,
            isLoading: true,
            epidemicClasses: [],
            epidemicNames: []
        }
    }

    componentDidMount(){
        //fetch the network data here
        console.log('trying to get data')
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/epidemic/epidemics';
        fetch(url, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) =>{
            let en = [];
            let ec = [];
            let previous = '';
            responseJson.forEach((vl, id) =>{
                en[id] = {'name' : vl.name};
                if(vl.family != previous){
                    ec[id] = {'family' : vl.family};
                }
                previous = vl.family;
            });
            this.setState({epidemicClasses: ec, epidemicNames: en});
            //closes the progress loading
            this.setState({isLoading: false});
        })
        .catch((error) => {
            //closes the progress loading
            this.setState({isLoading: false});
            console.log('failed to load data');
        });
    }

    render(){
        return(
            <KeyboardAvoidingView style={{ flex: 1}} behavior="padding">
                <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingStart: 14, paddingEnd: 14}}>
                    <Text style={{marginTop: 10, color: 'blue', fontSize: 16}}>Create News Content</Text>

                    <Text style={{marginTop: 10}}>Epidemic Name:</Text>
                    <TextInput placeholder='Enter Epidemic Name' onFocus={() => this.setState({textfield7: true}) }  
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 2, 
                        borderColor: this.state.textfield7 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_name} ref='name_input'>             
                    </TextInput>
                    <Modal visible={this.state.textfield7} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                        <View style={styles.familymodal}>
                            <FlatList data={this.state.epidemicNames}
                                renderItem={this._renderENames}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Epidemic class:</Text>
                    <TextInput placeholder='Enter Epidemic class' onFocus={() => this.setState({textfield8: true})}
                        style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1, marginTop: 2, 
                        borderColor: this.state.textfield8 == true ? 'skyblue' : 'gray'}} returnKeyType="none" value={this.state.e_class} ref='class_input'>             
                    </TextInput>
                    <Modal visible={this.state.textfield8} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['class_input'].blur()} >
                        <View style={styles.classmodal}>
                            <FlatList data={this.state.epidemicClasses}
                                renderItem={this._renderEClass}
                                keyExtractor={(item, index) => index.toString() }
                                ItemSeparatorComponent={this._listDivider} />
                        </View>
                    </Modal>

                    <Text style={{marginTop: 10}}>Source:</Text>
                    <TextInput placeholder='Enter News Source' style={styles.tf_source} onBlur={ () => this.setState({ testfield1: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield1: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.testfield1 == true ? 'skyblue' : 'gray'}} returnKeyType="next"
                        onSubmitEditing={() => this.handlesNext('2')} onChangeText={(text) => this.setState({source: text})}>             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Published Date:</Text>
                    <TextInput placeholder='Enter Date Published' style={styles.tf_source}
                        onFocus={() => this.setState({testfield2: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield2 == true ? 'skyblue' : 'gray'}} returnKeyType="done" ref='2' value={this.state.pDate}
                            onChangeText={text => this.setState({source: text})} >             
                    </TextInput>
                    <View>
                        { this.state.testfield2 &&
                        (<DateTimePicker timeZoneOffsetInMinutes={0} value={new Date()} 
                            is24Hour={true} onChange={(event, date) => this.setPDate(event, date) }/>
                        )}
                    </View>

                    <Text style={{marginTop: 10}}>Region:</Text>
                    <View style={{borderRadius: 5, borderColor: 'gray',borderWidth: 1, justifyContent: 'center', alignContent: 'stretch'}}>
                        <Picker style={{borderColor: 'gray', borderWidth: 1, borderRadius: 5,}} selectedValue={this.state.region}
                            onValueChange={(item, index) => this.setState({region: item}) }>
                            <Picker.Item  label='Africa' value='Africa' />
                            <Picker.Item  label='America' value='America' />
                            <Picker.Item  label='Asia' value='Asia' />
                            <Picker.Item  label='Europe' value='Europe' />
                            <Picker.Item  label='Artantic' value='Artantic' />
                        </Picker>
                    </View>

                    <Text style={{marginTop: 10}}>Country:</Text>
                    <TextInput placeholder='Enter Country involved' onBlur={ () => this.setState({ testfield3: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield3: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield3 == true ? 'skyblue' : 'gray'}} returnKeyType="done"
                            onChangeText={text => this.setState({country: text})} >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Media Files:</Text>
                    <View style={{ flexDirection: 'row', justifyContent:'flex-start', alignContent: 'flex-start'}} >
                        <Button title='Media One' buttonStyle={{height: 40, backgroundColor: 'gray'}} type="solid" titleStyle={{color: '#fff'}} 
                            icon={<Icon name='add' type='ionicons' iconStyle={{ color: '#fff', marginStart: 15}}/>} iconRight onPress={this._loadMediaOne} >
                        </Button>
                        <Button title='Media Two' buttonStyle={{height: 40, backgroundColor: 'gray', marginStart: 20}} type="solid" titleStyle={{color: '#fff'}} 
                            icon={<Icon name='add' type='ionicons' iconStyle={{color: '#fff', marginStart: 10}}/>} iconRight onPress={this._loadMediaTwo} >
                        </Button>
                    </View>

                    <Text style={{marginTop: 10}}>Content Title:</Text>
                    <TextInput placeholder='Enter Title' style={styles.tf_source4} style={styles.tf_source} onBlur={ () => this.setState({ testfield4: false }) } blurOnSubmit={false}
                        onFocus={() => this.setState({testfield4: true}) }  textAlignVertical='top' style={{height: 80, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield4 == true ? 'skyblue' : 'gray'}} returnKeyType="none" onSubmitEditing={() => this.handlesNext('3')}
                            onChangeText={text => this.setState({title: text})} multiline={true}>             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Content Detail:</Text>
                    <TextInput placeholder='Enter News In Detail' style={styles.tf_source} onBlur={ () => this.setState({ testfield5: false }) } blurOnSubmit={false}
                        onFocus={() => this.setState({testfield5: true}) }  style={{height: 150, paddingStart: 8, paddingTop: 8, borderRadius: 5, borderWidth: 1,
                            marginTop: 2, borderColor: this.state.testfield5 == true ? 'skyblue' : 'gray'}} ref='3' onSubmitEditing={() => this.handlesNext('4')} textAlignVertical='top'
                            onChangeText={text => this.setState({detail: text})} multiline={true} returnKeyType="none" >             
                    </TextInput>

                    <Text style={{marginTop: 10}}>Content Links(references):</Text>
                    <TextInput placeholder='Enter Link (links are separated by "," )' style={styles.tf_source} onBlur={ () => this.setState({ testfield6: false }) } blurOnSubmit={true}
                        onFocus={() => this.setState({testfield6: true}) }  style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,
                        marginTop: 2, borderColor: this.state.testfield6 == true ? 'skyblue' : 'gray'}} multiline={true} ref='4'
                        onChangeText={text => this.setState({reference: text})} >             
                    </TextInput>

                    <Button title='Submit Now!' type='solid' buttonStyle={styles.btn_ok}
                        onPress={() => this.createNewsItem()}/>

                </ScrollView>

                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"  />
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        );
    }

    handlesNext = (nxtField) =>{
        this.refs[nxtField].focus();
    }

    createNewsItem = async (...items) =>{
        //verify the data before doing the network data operation 
        let validInput = this.validateData();
        let bucket = 'https://weiscuser224453-prod.s3.us-east-2.amazonaws.com/public/';
        let file1 = '';
        let file2 = '';
        if(this.state.media1.length > 1){
            file1 = bucket + this.state.media1;
        }
        if(this.state.media2.length > 1){
            file2 = bucket + this.state.media2;
        }

        if(validInput == true){
            //shows loading bar
            this.setState({isLoading: true});
            //check if the image file exist
            if(this.state.media1.length > 10){
                //upload the image file
                await Storage.put(this.state.media1, this.state.blob_file, {
                    contentType: 'image/jpeg'})
                    .then(rst => {
                        console.log(rst);
                    })
                    .catch(err =>{
                        console.log(err);
                        file1 = '';
                    });
            }
            //checks if the video/image2 file exist
            if(this.state.media2.length > 10){
                //upload the second media file
                await Storage.put(this.state.media2, this.state.blob_file2, {
                    contentType: 'video/mp4'})
                    .then(rst => {
                        console.log(rst);
                    })
                    .catch(err => {
                        console.log(err);
                        file2 = '';
                    });
            }
            //make database communication to input news Item
            let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/create';
            fetch(url,{
                method: 'POST',
                body: JSON.stringify({
                    epidemic_name: this.state.e_name,
                    epidemic_class: this.state.e_class,
                    region: this.state.region,
                    country: this.state.country,
                    source: this.state.source,
                    detail: this.state.detail,
                    published_date: this.state.pDate,
                    media1: file1,
                    media2: file2,
                    reference: '' + this.state.reference
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading: false});
                    Alert.alert('', responseJson.message);
                })
                .catch((error) =>{
                    this.setState({isLoading: false});
                    Alert.alert('', error);
                });
        }
    }

    validateData = () => {
            //verify epidemic name
            if(this.state.e_name.length == 0){
                Alert.alert('','Enter Epidemic Name');
                return false;
            }
            //verify epidemic class
            if(this.state.e_class.length == 0){
                Alert.alert('','Enter Epidemic Name');
                return false;
            }
            //verify news source
            if(this.state.source.length == 0){
                Alert.alert('','Enter News Source');
                return false;
            }
            //verify published date
            if(this.state.pDate.length == 0){
                Alert.alert('','Enter News Date');
                return false;
            }
            //verify news region
            if(this.state.region.length == 0){
                Alert.alert('','Enter News Region');
                return false;
            }
            //verify news country
            if(this.state.country.length == 0){
                Alert.alert('','Enter News Country');
                return false;
            }
            //verify news region
            if(this.state.title.length == 0){
                Alert.alert('','Enter News Title');
                return false;
            }
            //verify news region
            if(this.state.detail.length == 0){
                Alert.alert('','Enter News Detail');
                return false;
            }

        return true;
    }

    _renderEClass = ({item}) => (
        <TouchableOpacity onPress={() => this.itemCClass(item) }>
            <Text style={{color: '#fff', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.family} </Text>
        </TouchableOpacity>
    );

    _renderENames = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => this.itemCName(item)} >
                <Text style={{color: '#fff', paddingTop: 8, paddingBottom: 8, paddingStart: 5}}> {item.name} Disease </Text>
            </TouchableOpacity>
        );
    }

    _listDivider = () =>{
        return(
            <View style={{height: 1, width: '100%',  backgroundColor: '#fff'}} />
        );
    }

    _showPickDate = () => {
        this.setState({testfield2: true});
        if(Platform.OS == 'android'){
            //open android date picker
            try{
                const {action, year, month, day} = DatePickerAndroid.open({
                    date: new Date()
                });
                if( action !== DatePickerAndroid.dismissedAction){
                    //selected year, month and day here
                    let dt = '${day}' + '/' + '${month}' + 1 + '/' + '${year}';
                    console.log(dt);
                    this.setState({pDate: dt});
                }
                
            }
            catch({code, message}){
                console.warn('can not open datePicker', message);
            }
        }
        else if(Platform.OS == 'ios'){
            //open ios date picker
            return(
                <DatePickerIOS mode="date" 
                    onDateChange={(date) =>{
                        console.log(date);
                    }} />
            );
        }

    }
    
    itemCName(item){
        console.log('name: ' + item.name);
        this.setState({textfield7: false, e_name: item.name});
    }

    itemCClass(item){
        console.log('family: ' + item.family);
        this.setState({textfield8: false, e_class: item.family});
    }
    
    setPDate = (event, date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let dt = day + '/' + month + '/' + year;
        //set the published date now
        this.setState({pDate: dt, testfield2: false})
    }

    _loadMediaOne = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if(!result.cancelled){
            try{
                const response = await fetch(result.uri);
                const blob = await response.blob();
                let date = this.state.pDate.replace("/", "-");
                let dt = new Date();
                let mins = dt.getMinutes();
                let sec = dt.getSeconds();
                let path = this.state.region + '/' + date + '-' + mins + '-' + sec + '-' + this.state.source.replace(" ", "_") + '-01aQ10b.jpg';

                this.setState({blob_file: blob, media1: path});
            }
            catch(err){
                console.log(err);
                Alert.alert('', 'media file not uploaded.');
            }
        }
    }

    _loadMediaTwo = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if(!result.cancelled){
            //show the progress loading 
            this.setState({isLoading: true});
            try{
                const response = await fetch(result.uri);
                const blob = await response.blob();
                let date = this.state.pDate.replace("/", "-");
                let dt = new Date();
                let mins = dt.getMinutes();
                let sec = dt.getSeconds();
                let path = this.state.region + '/' + date + '-' + mins + '-' + sec + '-' + this.state.source.replace(" ","_") + '-01aQ10b.mp4';
                
                this.setState({blob_file2: blob, media2: path});
            
            }
            catch(err){
                console.log(err);
                Alert.alert('','error' + err.message);
            }
        }
    }

}

const styles = StyleSheet.create({
    btn_ok: {
        borderRadius: 5,
        backgroundColor: 'skyblue',
        marginTop: 35,
        height: 45,
        marginBottom: 15,
    },

    classmodal: {
        justifyContent: 'flex-start', 
        marginTop: 200, 
        marginStart: 14,
        marginEnd: 14,
        backgroundColor: 'gray',
        borderRadius: 5
    },

    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 120, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    }

});