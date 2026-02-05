import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Api } from './services/api';
import { useState } from 'react';

export default function App() {

  const [joke, setJoke] = useState("");  
  const [loading, setLoading] = useState(false);

  const ApiService = new Api();

  async function handleGetJoke() {
    setLoading(true);
    setJoke("")
    
    try {
      const joke = await ApiService.getChuckJoke();
      setJoke(joke);
    } catch (error) { 
      console.error("Erro ao buscar piada: ", error);
    } finally {
      setLoading(false);
    }
  }  

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Pressable onPress={handleGetJoke} disabled={loading}>
        <Text>Press Me</Text>
      </Pressable>
      <Text>{joke}</Text>
    
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
