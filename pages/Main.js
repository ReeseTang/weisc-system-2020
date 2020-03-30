import React, {Component} from 'react';
import { View, Text, StyleSheet, SectionList, FlatList, Image, ScrollView,
     Alert, Modal, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Avatar, Icon, Card, Button, Header} from 'react-native-elements';


class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            isSuccess: false,
            country: '',
            region: '',
            news_nearest: [],
            news_region: [],
            news_global: [],
            news_data: []
        }

    }

    componentDidMount(){
        //fetch location 
        let addr = 'http://api.ipstack.com/check?access_key=da28b9a10e5c09d08c694e5abd6e9e82';
        fetch(addr, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let rg = responseJson.continent_name;
            let ct = responseJson.country_name;
            this.setState({country: ct, region: rg});
            this._loadData(rg, ct);
        })
        .catch(err =>{
            this._loadData('','');
        });

    }

    render(){
        return(
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <Header placement="left" 
                        leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                        centerComponent={{ text: 'WORLD EPIDERMIC NEWS AND INFORMATION UPDATES', style:{color: '#fff'} }} >
                    </Header>

                    <SectionList   
                                sections={this.state.news_data}
                                renderItem={this.renderItemList}
                                keyExtractor={(item, index) => item + index}
                                renderSectionHeader={({section: {title}}) => (
                                    <View style={{flex: 1, justifyContent: 'center', alignContent: 'flex-start', 
                                            marginTop: 15}} >
                                        <Text style={{color: 'gray', fontSize: 16, fontWeight: 'bold', paddingStart: 12, width: 250}} >{title}</Text>
                                    </View>
                                ) }
                                 />

                    <Modal visible={this.state.isLoading} presentationStyle="overFullScreen" transparent={true} >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large"  />
                        </View>
                    </Modal>
                </View>
        );
    }

    renderItemList = ({item}) => {
        return(
            <TouchableHighlight onPress={() => this._openNewsView(item)}> 
                <View style={styles.itemview}>
                    <View style={styles.text_con} >
                        <Text style={styles.itemText} ellipsizeMode='tail' numberOfLine={3} >
                            {item.title}
                        </Text>
                        <View style={styles.text_view2} >
                            <Text style={{color: 'gray', fontSize: 14}} >{item.source}</Text>
                            <Text style={{color: 'gray', fontSize: 14, paddingEnd: 5}} >{item.published_date}</Text>
                        </View>
                    </View>
                    <Image source={{uri: item.media_url_one}} style={{width: '40%', height: '100%'}} />
                </View>
            </TouchableHighlight>
        );
    }

    _renderDivider = () => {
        return(
            <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}/>
        );
    }

    _loadData = (region, country) => {
                //try make a network connection here
                let url = '';
                if(region.length > 1 && country.length > 1){
                    url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/fetch?region=' + region + '&country=' + country;
                    console.log('url: ' + url);
                }
                else{
                    url = 'https://39bx1z1x2b.execute-api.us-east-2.amazonaws.com/weisc-api/weiscinfo/news/fetch';
                }

                fetch(url,{
                    method: 'GET',
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading: false, isSuccess: true});
                    if(responseJson.code == 200){
                        let data_nearest = responseJson.nearest;
                        let data_region = responseJson.region;
                        let data_global = responseJson.global;
                        //commit the data to the UI View
                        this.setState({news_nearest: data_nearest, news_region: data_region, news_global: data_global}) ; 
                        this._prepareData(data_nearest, data_region, data_global);  
                    }
                    else{
                        Alert.alert('', 'failed fetching data');
                    }
                })
                .catch(err => {
                    this.setState({isLoading: false, isSuccess: false});
                    Alert.alert('', err.message);
                });
    }

    _prepareData(loc, reg, glo){
        let all_news;
        if(loc.length > 0 && reg.length > 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'News Latest in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                },
                {
                    'title': 'Global News Highlights on Epidemic',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length == 0 && reg.length > 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                },
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news}); 
        }
        else if(loc.length == 0 && reg.length == 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length == 0 && glo.length > 0){
            all_news = [
                {
                    'title': 'News Latest in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Global News Highlights on Epidemic ',
                    'data': glo
                }
            ]

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length == 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'News Latest in ' + this.state.country, //for the country location
                     'data': loc
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length == 0 && reg.length > 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                }
            ];

            this.setState({news_data: all_news});
        }
        else if(loc.length > 0 && reg.length > 0 && glo.length == 0){
            all_news = [
                {
                    'title': 'News Latest in ' + this.state.country, //for the country location
                     'data': loc
                },
                {
                    'title': 'Epidemic Highlights in ' + this.state.region, //for the region
                    'data': reg
                }
            ];

            this.setState({news_data: all_news});
        }
    }

    _openNewsView = (item) =>{
        this.props.navigation.navigate('NewsView',{title: item.title, body: item.detail, date: item.published_date, 
                    url_one: item.media_url_one, region: item.region, url_two: item.media_url_two});
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginTop: 25,
        marginStart: 15,
        backgroundColor: 'white',
        paddingStart: 14,
        paddingEnd: 14
    },

    itemview: {
        flex: 1,
        height: 120,
        flexDirection: 'row',
        borderRadius: 8,
        borderColor: 'gray',
        elevation: 2,
        marginStart: 10,
        marginEnd: 10,
        marginTop: 8,
        marginBottom: 8
    },

    itemText: {
        flex: 3,
        fontSize: 18,
        color: 'black',
        fontWeight: "bold",
        paddingTop: 5,
        paddingStart: 5,
    },

    text_con: {
        flex: 1,
        width: '58%',
        height: '100%',
        paddingStart: 3,
        justifyContent: 'flex-start',
        alignContent: 'stretch'
    },

    text_view2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingStart: 5
    }

});

export default Main;