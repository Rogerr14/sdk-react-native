import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../modules/home/views/homePage';
import { PresentationPage } from '../modules/presentation/view/PresentationPage';

const Stack = createStackNavigator();

export const  AppRoutes = ()=>{
    return(
        <Stack.Navigator initialRouteName='Presentation'>
            <Stack.Screen name='Presentation' component={PresentationPage} />
            <Stack.Screen name="Home" component={HomePage}/>
        </Stack.Navigator>
    )
}