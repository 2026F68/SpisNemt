import { useAuth } from "@/src/context/AuthContext";
import { Text, View } from "react-native";
import Button from "../../components/buttons/Button";
import { cardStyle } from "./CardTheme";

interface AccountCardProps {
  accountName: string;
  accountType: string;
  imageUrl?: string;
}

export default function AccountCard({
  accountName,
  accountType,
  imageUrl,
}: AccountCardProps) {
  const { user, signOut } = useAuth();

  return (
    <View style={cardStyle.AccountCardContainer}>
      <View style={cardStyle.AccountCardImage}></View>
      <View style={cardStyle.AccountTextContainer}>
        <Text style={cardStyle.AccountName}>{accountName}</Text>
        <Text style={cardStyle.AccountType}>{accountType}</Text>
      </View>
      <View style={{ marginLeft: 70, marginTop: 10 }}>
        <Button title="Sign Out" onPress={() => void signOut()} />
      </View>
    </View>
  );
}
