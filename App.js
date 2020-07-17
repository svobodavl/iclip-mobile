import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Appearance,
  Linking
} from 'react-native';
import { Header, Input } from 'react-native-elements';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [text, setText] = useState('');

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center', // Centered horizontally
      justifyContent: 'center',
      flex: 1,
    },
  });
  useEffect(() => {
    if (text.length === 5) {
      fetch(`http://uni.hys.cz/includes/get-api?user=${text}`)
        .then((response) => response.text())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [text]);

  return (
    <View>
      <Header
        centerComponent={{
          text: 'Interclip',
          style: { color: '#fff', fontSize: 32 },
        }}
        containerStyle={{
          backgroundColor: '#333333',
          justifyContent: 'space-around',
        }}
      />

      <View>
        <Input
          style={styles.container}
          placeholder="Ur code here"
          maxLength={5}
          inputStyle={{ fontSize: 50 }}
          autoCorrect={false}
          returnKeyType={'go'}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          errorStyle={{ color: 'red' }}
          autoCapitalize="none"
          autoFocus={true}
          value={text.replace(" ", "").toLowerCase()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {!isLoading ? Linking.openURL(data) : alert("bruh")}}
        />
        
        <View style={{ padding: 24 }}>

          <Text>{text}</Text>
        </View>
        <View style={{ padding: 24 }}>
          {isLoading ? <ActivityIndicator /> : <Text>{data}</Text>}
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}
