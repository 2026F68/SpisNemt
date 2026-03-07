import { View, Text } from 'react-native';
import { cardStyle } from './CardTheme';

interface AccountCardProps {
    accountName: string;
    accountType: string;
    imageUrl?: string;
}

export default function AccountCard({ accountName, accountType, imageUrl }: AccountCardProps) {
    return (
        <View style={cardStyle.AccountCardContainer}>
            <View style={cardStyle.AccountCardImage}></View>
            <View style={cardStyle.AccountTextContainer}>
                <Text style={cardStyle.AccountName}>{accountName}</Text>
                <Text style={cardStyle.AccountType}>{accountType}</Text>
            </View>
        </View>
    );
}