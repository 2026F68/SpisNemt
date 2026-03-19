import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { StyleSheet, View } from "react-native";
import Container from "../../components/structural/Container";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <Container>
      <View style={styles.loginContainer}>
        <Title>Welcome</Title>
        <Subtitle>Sign in to continue</Subtitle>
        <GoogleSigninButton onPress={signInWithGoogle} />
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
});
