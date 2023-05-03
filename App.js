import React, { useState, createContext, useContext, useEffect} from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import { auth } from "./config/firebase";

const Stack = createStackNavigator();
const AunthenticatedUserContext = createContext({});

const AunthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return(
    <AunthenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </AunthenticatedUserContext.Provider>
  )
}

function ChatStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}

function Authstack () {
  return(
  <Stack.Navigator defaultScreenOptions={Login} screenOptions={{ headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}

function RootNavigator () {
  const { user, setUser} = useContext(AunthenticatedUserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setLoading(false);

    });
    return () => unsubscribe();
  }, [user]);
  if(loading) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  return (
    <NavigationContainer>
      {user ? <ChatStack  /> : <Authstack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AunthenticatedUserProvider>
      <RootNavigator />
    </AunthenticatedUserProvider>
  );
}