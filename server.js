const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Раздаем статические файлы с правильными MIME типами
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.on('join', (data) => {
    const { room, username } = data;
    socket.join(room);
    
    if (!rooms[room]) {
      rooms[room] = {
        users: [],
        videoState: { position: 0, isPlaying: false }
      };
    }
    
    rooms[room].users.push({ id: socket.id, username });
    console.log(`${username} присоединился к комнате ${room}`);
    
    // Отправляем текущее состояние видео
    socket.emit('sync', rooms[room].videoState);
    
    // Отправляем количество пользователей
    io.to(room).emit('userCount', rooms[room].users.length);
    
    // Отправляем список участников
    io.to(room).emit('participants', rooms[room].users);
  });

  socket.on('sync', (data) => {
    const { room, position, isPlaying } = data;
    
    if (rooms[room]) {
      rooms[room].videoState = { position, isPlaying };
      socket.to(room).emit('sync', { position, isPlaying });
    }
  });

  socket.on('message', (data) => {
    const { room, text, username } = data;
    io.to(room).emit('message', { text, username });
  });

  socket.on('setSource', (data) => {
    const { room, type, videoId, url } = data;
    socket.to(room).emit('setSource', { type, videoId, url });
  });

  socket.on('leave', (room) => {
    socket.leave(room);
    if (rooms[room]) {
      rooms[room].users = rooms[room].users.filter(u => u.id !== socket.id);
      io.to(room).emit('userCount', rooms[room].users.length);
      io.to(room).emit('participants', rooms[room].users);
      
      if (rooms[room].users.length === 0) {
        delete rooms[room];
      }
    }
  });

  socket.on('reaction', (data) => {
    const { room, emoji } = data;
    socket.to(room).emit('reaction', { emoji });
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
    
    Object.keys(rooms).forEach(roomCode => {
      const index = rooms[roomCode].users.findIndex(u => u.id === socket.id);
      if (index > -1) {
        rooms[roomCode].users.splice(index, 1);
        io.to(roomCode).emit('userCount', rooms[roomCode].users.length);
        
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
