import React,{ Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { Header, Icon } from 'react-native-elements';


export default class NewsPage extends Component {
    constructor(props){
        super(props);
        let body = this.props.route.params.body;
        let ttl = this.props.route.params.title;
        let dt = this.props.route.params.date;
        let img_link = this.props.route.params.url_one;
        let vid_link = this.props.route.params.url_two;
        let reg = this.props.route.params.region;
        //sets the state of the view
        this.state = {
                detail: body,
                title: ttl,
                date: dt,
                img_url: img_link,
                vid_url: vid_link,
                region: reg,
                related_data:[]
            }

    }

    componentDidMount(){
        //loads the related news here using the region
        let url = '';
        fetch(url,{method: 'GET'}).then((response) => response.json())
                .then((responseJson) => {
                    let related = responseJson.relatedNews;
                    this.setState({related_data: related});
                })
                .catch(err => {
                    
                });
    }

    render(){
        return(
            <View>
                <Header placement="left" 
                    leftComponent={<Icon name="menu" color="#fff" onPress={() => this.props.navigation.openDrawer() } />}
                    centerComponent={{ text: this.state.title, style:{color: '#fff'} }} >
                </Header>
                <ScrollView>
                    <Text style={styles.title_con} >
                        {this.state.title}
                    </Text>
                    <Text style={{fontSize: 14, color: 'gray'}}>
                        Published on {this.state.date}
                    </Text>

                    <Image style={styles.img_con} source={{uri: this.state.img_url}} />
                    <Text style={styles.detail_con} >
                        {this.state.detail}
                    </Text>

                    <Text style={{fontSize: 16, color: 'gray', fontWeight: 'normal'}} >
                        Related News
                    </Text>
                    <View style={{flex: 1, justifyContent: 'flex-start'}}>
                        <FlatList data={this.state.related_data}
                            renderItem={this._renderItems}
                            keyExtractor={(item, index) => index.toString() } 
                            />
                    </View>


                </ScrollView>
            </View>
        );
    }

    _renderItems = ({item}) => {
        return(
            <TouchableHighlight onPress={() => this._openNewsView(item)}> 
                <View style={styles.itemview}>
                    <View style={styles.text_con} >
                        <Text style={styles.itemText} ellipsizeMode='tail' >
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
}

const styles = StyleSheet.create({
    head_con: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        paddingTop: 15,
        marginStart: 14,
        marginEnd: 14
    },

    img_con: {
        width: '100%',
        height: 320,
        marginTop: 5,
        marginBottom: 5,
    },

    detail_con: {
        fontSize: 16, 
        fontStyle: 'normal', 
        color: 'black', 
        fontWeight: 'normal'
    },

    title_con: {
        fontSize: 18, 
        color: 'black', 
        fontStyle: 'normal', 
        fontWeight: 'bold'
    },

    itemview: {
        flex: 1,
        height: 80,
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
        paddingTop: 8,
        paddingBottom: 8,
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