import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import * as SecureStore from "expo-secure-store";
import { loginUser } from "../services/login_api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function getToken() {
    let result = await SecureStore.getItemAsync("user_token");
    if (result) {
      console.log("User is logged in with token: " + result);
      return result;
    } else {
      console.log("No token found.");
      return null;
    }
  }

  async function deleteToken() {
    await SecureStore.deleteItemAsync("user_token");
  }

  // This is where your Spring Boot logic will eventually live
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Error",
        "Look again through the fields, something is missing.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.token) Alert.alert("Login Successful", "Welcome back!");
      else Alert.alert("Login Failed", "Check your credentials and try again.");

      // 1. Save the token so the user stays logged in
      await SecureStore.setItemAsync("user_token", data.token);

      navigation.replace("SelectUser");
    } catch (error) {
      Alert.alert(
        "Access Denied",
        "Incorrect credentials. Try again.\n" + error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>
          Welcome to <Text style={styles.italic}>EMEIA</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.hyperlinkText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>

        {/* just for testing, not part of the UI */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate("SelectUser")}
        >
          <Text style={styles.hyperlinkText}>
            Go to Home page (just for testing, will be removed later)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // True Black
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FF8C00", // Bright Orange
    textAlign: "center",
    marginBottom: 50,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1A1A1A", // Dark Grey for inputs
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#FF8C00", // Orange border
  },
  loginButton: {
    backgroundColor: "#FF8C00", // Orange Button
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loginButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  linkContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  hyperlinkText: {
    color: "#FF8C00",
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  italic: {
    fontStyle: "italic",
    fontWeight: "200",
  },
});
