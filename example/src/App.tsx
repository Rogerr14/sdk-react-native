import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './modules/home/views/homePage';
import { AppRoutes } from './routes/AppRouter';
import 'react-native-get-random-values';

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes></AppRoutes>
    </NavigationContainer>
  );
}


