const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Раздаем статические файлы
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.on('join', (roomCode) => {
    socket.join(roomCode);
    
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        users: [],
        videoState: { position: 0, isPlaying: false }
      };
    }
    
    rooms[roomCode].users.push(socket.id);
    console.log(`Пользователь ${socket.id} присоединился к комнате ${roomCode}`);
    
    // Отправляем текущее состояние видео
    socket.emit('sync', rooms[roomCode].videoState);
  });

  socket.on('sync', (data) => {
    const { room, position, isPlaying } = data;
    
    if (rooms[room]) {
      rooms[room].videoState = { position, isPlaying };
      // Отправляем всем в комнате кроме отправителя
      socket.to(room).emit('sync', { position, isPlaying });
    }
  });

  socket.on('message', (data) => {
    const { room, text } = data;
    io.to(room).emit('message', { text, sender: socket.id });
  });

  socket.on('setSource', (data) => {
    const { room, type, videoId, url } = data;
    socket.to(room).emit('setSource', { type, videoId, url });
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
    
    // Удаляем из всех комнат
    Object.keys(rooms).forEach(roomCode => {
      const index = rooms[roomCode].users.indexOf(socket.id);
      if (index > -1) {
        rooms[roomCode].users.splice(index, 1);
        
        // Удаляем пустые комнаты
        if (rooms[roomCode].users.length === 0) {
          delete rooms[roomCode];
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Открой браузер и перейди по адресу выше');
});
