import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditorsPage from '../editors/Editors';
import AdminLoginPage from '../editors/AdminLogin';
import AddFact from '../editors/NewFacts';
import AddNews from '../editors/AddNews';
import Control from '../editors/Control';
import AddArticle from '../editors/AddArticle';

const StackNav = createStackNavigator();

export default function MyStack(){
    return(
        <StackNav.Navigator initialRouteName="EditorsLogin">
            <StackNav.Screen name="EditorsLogin" component={AdminLoginPage} options={{ title: 'CONTENT EDITORS LOGIN' }} />
            <StackNav.Screen name="Content" component={EditorsPage} options={{ title: 'EDITORS DASHBOARD' }} />
            <StackNav.Screen name="NewFact" component={AddFact} options={{ title:'NEW FACT ON EPIDERMIC'}}  />
            <StackNav.Screen name="NewNews" component={AddNews} options={{ title:'NEWS UPDATE ON EPIDERMIC'}} />
            <StackNav.Screen name="Control" component={Control} options={{ title: 'PRECAUTION & CONTROL'}} />
            <StackNav.Screen name="AddArticle" component={AddArticle} options={{ title: 'PUBLISH ARTICLE ON EPIDEMIC'}} />
        </StackNav.Navigator>
    );
}
