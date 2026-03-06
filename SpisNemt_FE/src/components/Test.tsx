import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import db from "../../firebaseConfig";

export default function Test() {
  const [preferences, setPreferences] = useState<any[]>([]);

  const getPreferences = async () => {
    const querySnapshot = await getDocs(collection(db, "preferences"));
    
    const data = querySnapshot.docs.map(doc => doc.data());
    setPreferences(data);
  };

  useEffect(() => {
    getPreferences();
  }, []);

  return (
    <View>
      <Text>Preferences:</Text>
      {preferences.map((pref, index) => (
        <View key={index}>
          <Text>{pref.preferences}</Text>
          <Text>{pref.preference}</Text>
        </View>
      ))}
    </View>
  );
}