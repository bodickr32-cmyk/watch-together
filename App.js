import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import io from 'socket.io-client';

export default function App() {
  const [roomCode, setRoomCode] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Подключаемся к серверу синхронизации
    socketRef.current = io('http://localhost:3000');
    
    socketRef.current.on('sync', (data) => {
      // Синхронизируем видео
      if (videoRef.current) {
        videoRef.current.setPositionAsync(data.position * 1000);
        if (data.isPlaying) {
          videoRef.current.playAsync();
        } else {
          videoRef.current.pauseAsync();
        }
      }
    });

    socketRef.current.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const joinRoom = () => {
    if (roomCode.trim()) {
      socketRef.current.emit('join', roomCode);
      setInRoom(true);
    }
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      socketRef.current.emit('message', { room: roomCode, text: messageText });
      setMessageText('');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && inRoom) {
      socketRef.current.emit('sync', {
        room: roomCode,
        position: status.positionMillis / 1000,
        isPlaying: status.isPlaying
      });
    }
  };

  if (!inRoom) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎬 Watch Together</Text>
        <Text style={styles.subtitle}>Смотри видео с друзьями</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Введи код комнаты"
          placeholderTextColor="#888"
          value={roomCode}
          onChangeText={setRoomCode}
        />
        
        <TouchableOpacity style={styles.button} onPress={joinRoom}>
          <Text style={styles.buttonText}>Присоединиться</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]} 
          onPress={() => {
            const code = Math.random().toString(36).substr(2, 6).toUpperCase();
            setRoomCode(code);
          }}
        >
          <Text style={styles.buttonText}>Создать комнату</Text>
        </TouchableOpacity>
        
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomCode}>Комната: {roomCode}</Text>
        <TouchableOpacity onPress={() => setInRoom(false)}>
          <Text style={styles.leaveButton}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <Video
        ref={videoRef}
        source={{ uri: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Сообщение..."
            placeholderTextColor="#888"
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 50,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginHorizontal: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#7700ff',
    padding: 18,
    borderRadius: 10,
    marginHorizontal: 30,
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  roomCode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveButton: {
    color: '#ff4444',
    fontSize: 16,
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    marginTop: 10,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#7700ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
