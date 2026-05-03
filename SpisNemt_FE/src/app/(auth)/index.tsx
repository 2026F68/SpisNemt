import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../components/buttons/Button";
import Container from "../../components/structural/Container";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      if (!email.trim() || !password) {
        setError("Please enter both email and password.");
        return;
      }

      await signIn(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("auth/network-request-failed")) {
        setError("Network error. Check your internet connection and try again.");
      } else if (
        errorMessage.includes("auth/invalid-credential") ||
        errorMessage.includes("auth/invalid-login-credentials")
      ) {
        setError("Sign in failed. Check your email and password.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    }
  };

  const handleCreateAccount = () => {
    router.push("./create-account");
  };

  return (
    <Container>
      <View style={styles.loginContainer}>
        <Title>Welcome</Title>
        <Subtitle>Sign in to continue</Subtitle>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#bdbdbd"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#bdbdbd"
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.formActions}>
          <Button
            title={isLoading ? "Signing in..." : "Sign In"}
            onPress={() => void handleSignIn()}
            disabled={isLoading}
          />
          <Button
            title="Create Account"
            onPress={() => void handleCreateAccount()}
            disabled={isLoading}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 48,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#d00",
    marginBottom: 12,
  },
  formActions: {
    width: "90%",
  },
});
