import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ErrorBoundaryRoot>{children}</ErrorBoundaryRoot>;
}

class ErrorBoundaryRoot extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ resetError }: { resetError: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong.</Text>
      <Text style={styles.message}>
        The app ran into an unexpected problem. You can try again.
      </Text>

      <Pressable style={styles.button} onPress={resetError}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#111",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});