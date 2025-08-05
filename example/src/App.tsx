import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './modules/home/views/homePage';
import { AppRoutes } from './routes/AppRouter';

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes></AppRoutes>
    </NavigationContainer>
  );
}


