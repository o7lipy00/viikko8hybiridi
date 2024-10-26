import { Button, StyleSheet, SafeAreaView, TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { addDoc, collection, query, onSnapshot, deleteDoc, doc, orderBy, Timestamp } from 'firebase/firestore'; 
import { firestore, MESSAGES } from './Firebase/Config'; 
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const save = async () => {
    if (newMessage.trim() === '') return;
    try {
      const docRef = await addDoc(collection(firestore, MESSAGES), {
        text: newMessage,
        timestamp: Timestamp.fromDate(new Date())
      });
      console.log('Document written with ID: ', docRef.id);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(firestore, MESSAGES, id));
      console.log('Document deleted with ID: ', id);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        tempMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(tempMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>KAUPPALISTA</Text>
        
        <TextInput
          placeholder='LISÄÄ UUSI...'
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          style={styles.input}
        />
        <Button title="TALLENNA" onPress={save} />
        
        <ScrollView>
          {messages.map((message) => (
            <View key={message.id} style={styles.message}>
              <Text style={styles.messageText}>{message.text}</Text>
              <TouchableOpacity onPress={() => deleteMessage(message.id)} style={styles.deleteButton}>
                <Icon name="delete" size={35} color="black" /> 
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  messageText: {
    flex: 1,
  },
  deleteButton: {
    paddingLeft: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
