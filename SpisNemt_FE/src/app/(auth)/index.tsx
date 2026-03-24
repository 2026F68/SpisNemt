import { StyleSheet, View } from "react-native";
import Button from "../../components/buttons/Button";
import Container from "../../components/structural/Container";
import Subtitle from "../../components/typograghy/Subtitle";
import Title from "../../components/typograghy/Title";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <Container>
      <View style={styles.loginContainer}>
        <Title>Welcome</Title>
        <Subtitle>Sign in to continue</Subtitle>
        <Button title="Sign In" onPress={() => void signIn()} />
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
