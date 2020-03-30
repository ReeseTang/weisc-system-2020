import React,{ Component } from 'react';
import { View, Text, StyleSheet, SectionList, Alert, FlatList,
        Modal, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { Button, Header, Icon, Badge } from 'react-native-elements';


export default class Precaution extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            txt1: false,
            epidemicNames: [],
            epidemicClasses: [],
            p_control:[],
            e_name: '',
        }
    }

    componentDidMount(){
        //fetch the network data here
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
            // this.setState({isLoading: false});
            //loads the initial/latest precaution
            this._loadPControl('none');
        })
        .catch((error) => {
            //closes the progress loading
            this.setState({isLoading: false});
            console.log('failed to load data');
        });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header placement="left" 
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: 'PRECAUTION AND CONTROL ON EPIDEMIC', style:{color: '#fff'} }} >
                </Header>
                
                <TextInput placeholder='Select Epidemic ' onFocus={() => this.setState({txt1: true}) } 
                    style={{height: 45, paddingStart: 8, borderRadius: 5, borderWidth: 1,marginTop: 2, 
                    borderColor: this.state.txt1 == true ? 'skyblue' : 'gray', marginStart: 10, marginEnd: 10, marginTop: 4}} returnKeyType="none" ref='name_input'>             
                </TextInput>
                <Modal visible={this.state.txt1} presentationStyle="overFullScreen" transparent={true} style={{flex: 1}} onShow={() => this.refs['name_input'].blur()} >
                    <View style={styles.familymodal}>
                        <FlatList data={this.state.epidemicNames}
                            renderItem={this._renderENames}
                            keyExtractor={(item, index) => index.toString() }
                             />
                    </View>
                </Modal>

                <Text style={{fontSize: 18, color: 'black', marginTop: 10, marginBottom: 5, marginStart:10}} >
                    Precautions And Control For {this.state.e_name} 
                </Text>              
                <SectionList  style={{flex: 3}}
                        sections={this.state.p_control}
                        renderItem={this._renderUIItems}
                        keyExtractor={(item, index) => item + index}
                        renderSectionHeader={({section: {title}}) => (
                            <View style={{flex: 1, justifyContent: 'center', alignContent: 'flex-start', 
                                    marginTop: 10, backgroundColor: 'gray', height: 40}} >
                                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', paddingStart: 12}} >{title}</Text>
                            </View>
                        ) } />
                 
                <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large"  />
                    </View>
                </Modal>

            </View>
            );
    }

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

    itemCName(item){
        this.setState({txt1: false, e_name: item.name, isLoading: true});
        let v = item.name;
        this._loadPControl(v);
    }

    _loadPControl = (name) => {
        //get the precaution and control on the selected disease
        let url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/control/fetch?filter=' + name;
        fetch(url, {method: 'GET'}).then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.code == 200){
                        let rp = responseJson.precaution;
                        let rc = responseJson.control;
                        let nm = responseJson.epidemic_name;
                         
                        if(rp.charAt(0) == '#'){
                            rp = rp.substring(1);
                        }
                        if(rc.charAt(0) == '#'){
                            rc = rc.substring(1);
                        }

                        let preco = rp.split('#');
                        let contro = rc.split('#');

                        //organizes the precautions and control data
                        let data = [
                            {
                                'title': 'Precaution',
                                'data':  preco
                            },
                            {
                                'title': 'Control',
                                'data': contro
                            }
                        ];
                        //apply the data to the 
                        this.setState({p_control: data, isLoading: false, e_name: nm});
                    }
                    else{
                        this.setState({isLoading: false});
                        if(name != 'none'){
                            Alert.alert('', 'no precaution made available. try again later!');
                        }
                    }
                })
                .catch(err =>{
                    console.log(err);
                    Alert.alert('', err.message);
                });
    }

    _renderUIItems = ({item}) =>{
        return(
            <View style={{ flexDirection: 'row', alignContent: 'flex-start', marginTop: 5, paddingStart: 25}} >
                <Badge status="primary" containerStyle={{marginTop: 8}} />
                <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold', marginStart: 5}} > {item} </Text>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingStart: 14,
        paddingEnd: 14
    },

    top_view: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10,
        marginStart: 14,
        marginEnd: 14
    },

    familymodal: {
        justifyContent: 'flex-start', 
        marginTop: 140, 
        marginStart: 14,
        marginEnd: 14,  
        backgroundColor: 'gray',
        borderRadius: 5
    }

});