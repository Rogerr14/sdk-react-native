import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../modules/home/views/homePage';
import { PresentationPage } from '../modules/presentation/view/PresentationPage';
import AppBarComponent from '../shared/components/AppBar/AppBarComponent';
import { Platform } from 'react-native';

const Stack = createStackNavigator();




export const  AppRoutes = ()=>{
    return(
        <Stack.Navigator 
        initialRouteName='Presentation'>
            <Stack.Screen name='Presentation' component={PresentationPage} options={
                {
                    headerShown: false
                }
            } />
            <Stack.Screen name="Home" component={HomePage} options={{
                headerShadowVisible: false,
                headerMode: 'screen',
                headerStyle:{
                    backgroundColor: 'transparent'
                },
                headerTitle(props) {
                    props.style = false;
                    return <AppBarComponent/>
                },
            }}/>
        </Stack.Navigator>
    )
}