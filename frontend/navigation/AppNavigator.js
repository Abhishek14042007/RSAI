import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminScreen from "../screens/AdminScreen";
import AlumniScreen from "../screens/AlumniScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";
import ChatRequestsScreen from "../screens/ChatRequestsScreen";
import ChatScreen from "../screens/ChatScreen";
import CommunityScreen from "../screens/CommunityScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResourceDetails from "../screens/ResourceDetails";
import SearchScreen from "../screens/SearchScreen";
import UploadScreen from "../screens/UploadScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

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
                <Stack.Screen
                    name="Alumni"
                    component={AlumniScreen}
                />
                <Stack.Screen
                    name="ChatRequests"
                    component={ChatRequestsScreen}
                />
                <Stack.Screen
                    name="ChatList"
                    component={ChatListScreen}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                />
                <Stack.Screen
                    name="ChatMessages"
                    component={ChatMessagesScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="UserProfile"
                    component={UserProfileScreen}
                />
                <Stack.Screen
                    name="Admin"
                    component={AdminScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}