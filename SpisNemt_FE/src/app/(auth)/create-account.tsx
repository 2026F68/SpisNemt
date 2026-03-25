import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../components/buttons/Button";
import Container from "../../components/structural/Container";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";

export default function CreateAccountScreen() {
  const router = useRouter();
  const { createAccount, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    try {
      setError(null);
      if (!email.trim() || !password || !name.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      await createAccount(email, password, name);
      router.back();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (errorMessage.includes("email-already-in-use")) {
        setError("Email already in use.");
      } else if (errorMessage.includes("invalid-email")) {
        setError("Invalid email address.");
      } else if (errorMessage.includes("weak-password")) {
        setError("Password is too weak.");
      } else {
        setError("Could not create account.");
      }
    }
  };

  return (
    <Container>
      <View style={styles.createContainer}>
        <Title>Create Account</Title>
        <Subtitle>Enter your details</Subtitle>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password (min 6 characters)"
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title={isLoading ? "Creating account..." : "Create Account"}
          onPress={() => void handleCreateAccount()}
          disabled={isLoading}
        />
        <Button
          title="Back to Sign In"
          onPress={() => router.back()}
          disabled={isLoading}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  createContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 48,
  },
  input: {
    width: "100%",
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
});
