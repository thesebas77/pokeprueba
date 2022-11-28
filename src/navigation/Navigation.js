import React from 'react';
import { AuthContext } from '../contexts/AuthContext'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import PerfilScreen from '../screens/PerfilScreen'
import TeamCreateScreen from '../screens/TeamCreateScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation() {
    const {logged} = React.useContext(AuthContext);

    if(!logged) return <LoginNavigator />
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Inicio"
            >
                <Tab.Screen 
                    name="Inicio"  
                    component={RootNavigator} 
                    options={{
                        tabBarLabel: 'Inicio',
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Icon name="home" color={color} size={20} />                            
                        ),
                      }}
                />
                <Tab.Screen 
                    name="Mis equipos"  
                    component={TeamNavigator} 
                    options={{
                        tabBarLabel: 'Mis Equipos',
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Icon name="ios-book" color={color} size={20} />
                        )
                    }}
                />
                <Tab.Screen 
                    name="Perfil"  
                    component={PerfilScreen} 
                    options={{
                        tabBarLabel: 'Perfil',
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Icon name="happy-outline" color={color} size={20} />
                        )
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function RootNavigator() {
    return<Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Bienvenido'}}
        />
        <Stack.Screen
            name="TeamCreate"
            component={TeamCreateScreen}
            options={({ route }) => ({ title: `Region ${route.params.name}`, headerBackTitle: 'Atras'})}
        />
    </Stack.Navigator>
}

function TeamNavigator() {
    return<Stack.Navigator>
        <Stack.Screen
            name="Team"
            component={TeamsScreen}
            options={{title: 'Mis Equipos'}}
        />
        <Stack.Screen
            name="TeamCreate"
            component={TeamCreateScreen}
            options={({ route }) => ({ title: `Region ${route.params.name}`, headerBackTitle: 'Atras'})}
        />
    </Stack.Navigator>
}

function LoginNavigator() {
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
            />
        </Stack.Navigator>
    </NavigationContainer>   
}