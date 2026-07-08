import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommunityScreen from "../screens/CommunityScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResourceDetails from "../screens/ResourceDetails";
import SearchScreen from "../screens/SearchScreen";
import UploadScreen from "../screens/UploadScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            >

                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Upload" component={UploadScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="ResourceDetails" component={ResourceDetails} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen
                    name="Community"
                    component={CommunityScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}