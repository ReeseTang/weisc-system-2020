import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import Home  from './pages/Main';
import FactPage from './pages/Facts';
import ReportPage from './pages/ReportCase';
import ArticlePage from './pages/Articles';
import ResearchPage from './pages/ResearchAndFindings';
import NavPage from './components/AppNavigator';
import Precaution from './pages/Precaution';
import NewsNav from './components/NewsNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Icon, Avatar } from 'react-native-elements';
import config from './aws-exports';
import Amplify from 'aws-amplify'
        Amplify.configure(config);

export default function App() {
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='NewsNav'
         drawerContent={props => <CustomDrawerCompoment {...props} /> } >

        <Drawer.Screen name='NewsNav' component={NewsNav} 
            options={{ drawerLabel: 'WEISC Main', drawerIcon: ({tintColor}) =>(
              <Icon name="home" type="fontawesome"/>
            )}} />
            
        <Drawer.Screen name='Facts' component={FactPage} 
            options={{ drawerLabel: 'Epidermic Facts', drawerIcon: ({tintColor}) =>(
              <Icon name="phone" type="fontawesome"/>
            )}} />

        <Drawer.Screen name='Precaution' component={Precaution}
            options={{ drawerLabel: "Precaution & Control", drawerIcon: ({tintColor}) => (
              <Icon name="star" type="fontawesome" />
            )}} />

        <Drawer.Screen name='Report' component={ReportPage} 
            options={{ drawerLabel: 'Report Symptom Case', drawerIcon: ({tintColor}) =>(
              <Icon name="book" type="fontawesome"/>) }} />

        <Drawer.Screen name='Article' component={ArticlePage} 
            options={{drawerLabel: 'Article On Epidemic', drawerIcon: ({tintColor}) =>(
              <Icon name="flag" type="fontawesome"/>) }} />

        <Drawer.Screen name='Research' component={ResearchPage} 
            options={{ drawerLabel: 'Research And Findings', drawerIcon: ({tintColor}) =>(
              <Icon name="star" type="fontawesome"/>) }} />

        <Drawer.Screen name='Admins' component={NavPage}
            options={{ drawerLabel: 'Publish Material', drawerIcon:({tintColor}) =>(
              <Icon name="star" type="fontawesome" /> ) }} />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerCompoment(props) {
     
  return(
    <DrawerContentScrollView {...props}>
      <View style={styles.topView} >
        <Avatar size="large" source={require('./assets/images/ic2.png')} rounded />
        <Text style={styles.nem}>WEISC</Text>
        <Text style={{fontSize: 12, color: 'black'}}>Epidermic Information System And Control. Facts, Research, News, Findings and More</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  topView: {
    height: 152,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingStart: 15,
    paddingEnd: 15,
    paddingBottom: 4,
    backgroundColor: 'red'
  },

  nem: {
    fontSize: 21,
    color: 'white',
    alignSelf: 'flex-start'
  },

  topMssg: {
    fontSize: 18,
    color: 'white',
    marginTop: 10
  }

});

