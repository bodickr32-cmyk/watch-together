const socket = io();
let currentUser = '';
let currentRoom = '';
let currentSource = '';
const video = document.getElementById('video');
const youtubePlayer = document.getElementById('youtubePlayer');

function login() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        currentUser = username;
        localStorage.setItem('username', username);
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        document.getElementById('username').textContent = username;
        document.getElementById('userAvatar').textContent = username[0].toUpperCase();
    }
}

// Проверка сохраненного пользователя
window.onload = () => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        document.getElementById('username').textContent = savedUser;
        document.getElementById('userAvatar').textContent = savedUser[0].toUpperCase();
    }
};

function createRoom() {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    currentRoom = code;
    socket.emit('join', { room: code, username: currentUser });
    showRoomScreen();
}

function showJoinModal() {
    document.getElementById('joinModal').style.display = 'flex';
}

function closeJoinModal() {
    document.getElementById('joinModal').style.display = 'none';
}

function joinRoom() {
    const code = document.getElementById('joinRoomCode').value.trim().toUpperCase();
    if (code) {
        currentRoom = code;
        socket.emit('join', { room: code, username: currentUser });
        closeJoinModal();
        showRoomScreen();
    }
}

function showRoomScreen() {
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('roomScreen').style.display = 'block';
    document.getElementById('currentRoom').textContent = currentRoom;
    document.getElementById('roomUsername').textContent = currentUser;
    document.getElementById('roomUserAvatar').textContent = currentUser[0].toUpperCase();
}

function leaveRoom() {
    socket.emit('leave', currentRoom);
    document.getElementById('roomScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('sourceSelector').style.display = 'block';
    document.getElementById('videoContainer').style.display = 'none';
    currentRoom = '';
    currentSource = '';
}

function selectSource(type) {
    document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.source-btn').classList.add('active');
    
    document.getElementById('youtubeInput').style.display = 'none';
    document.getElementById('urlInput').style.display = 'none';
    document.getElementById('fileInput').style.display = 'none';
    
    if (type === 'youtube') {
        document.getElementById('youtubeInput').style.display = 'block';
    } else if (type === 'url') {
        document.getElementById('urlInput').style.display = 'block';
    } else if (type === 'file') {
        document.getElementById('fileInput').style.display = 'block';
    }
}

function loadYoutube() {
    const url = document.getElementById('youtubeUrl').value.trim();
    if (!url) return;
    
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
        currentSource = 'youtube';
        youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        youtubePlayer.style.display = 'block';
        video.style.display = 'none';
        document.getElementById('sourceSelector').style.display = 'none';
        document.getElementById('videoContainer').style.display = 'block';
        
        socket.emit('setSource', { room: currentRoom, type: 'youtube', videoId, username: currentUser });
    }
}

function loadUrl() {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) return;
    
    currentSource = 'url';
    video.src = url;
    video.style.display = 'block';
    youtubePlayer.style.display = 'none';
    document.getElementById('sourceSelector').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'block';
    
    socket.emit('setSource', { room: currentRoom, type: 'url', url, username: currentUser });
}

function loadFile() {
    const file = document.getElementById('videoFile').files[0];
    if (!file) return;
    
    currentSource = 'file';
    const url = URL.createObjectURL(file);
    video.src = url;
    video.style.display = 'block';
    youtubePlayer.style.display = 'none';
    document.getElementById('sourceSelector').style.display = 'none';
    document.getElementById('videoContainer').style.display = 'block';
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (text) {
        socket.emit('message', { room: currentRoom, text, username: currentUser });
        input.value = '';
    }
}

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Socket events
socket.on('sync', (data) => {
    if (currentSource === 'youtube') return;
    video.currentTime = data.position;
    if (data.isPlaying) {
        video.play();
    } else {
        video.pause();
    }
});

socket.on('setSource', (data) => {
    if (data.type === 'youtube') {
        currentSource = 'youtube';
        youtubePlayer.src = `https://www.youtube.com/embed/${data.videoId}?enablejsapi=1`;
        youtubePlayer.style.display = 'block';
        video.style.display = 'none';
        document.getElementById('sourceSelector').style.display = 'none';
        document.getElementById('videoContainer').style.display = 'block';
    } else if (data.type === 'url') {
        currentSource = 'url';
        video.src = data.url;
        video.style.display = 'block';
        youtubePlayer.style.display = 'none';
        document.getElementById('sourceSelector').style.display = 'none';
        document.getElementById('videoContainer').style.display = 'block';
    }
});

socket.on('message', (msg) => {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-author">${msg.username}</div>
        <div class="message-text">${msg.text}</div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('userCount', (count) => {
    document.getElementById('roomUsers').textContent = `👥 ${count} ${count === 1 ? 'участник' : 'участников'}`;
});

// Video sync events
video.addEventListener('play', () => {
    if (currentRoom && currentSource !== 'youtube') {
        socket.emit('sync', {
            room: currentRoom,
            position: video.currentTime,
            isPlaying: true
        });
    }
});

video.addEventListener('pause', () => {
    if (currentRoom && currentSource !== 'youtube') {
        socket.emit('sync', {
            room: currentRoom,
            position: video.currentTime,
            isPlaying: false
        });
    }
});

video.addEventListener('seeked', () => {
    if (currentRoom && currentSource !== 'youtube') {
        socket.emit('sync', {
            room: currentRoom,
            position: video.currentTime,
            isPlaying: !video.paused
        });
    }
});


// Participants
socket.on('participants', (participants) => {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';
    participants.forEach(p => {
        const item = document.createElement('div');
        item.className = 'participant-item';
        item.innerHTML = `
            <div class="participant-avatar">${p.username[0].toUpperCase()}</div>
            <div class="participant-name">${p.username}</div>
            <div class="participant-status"></div>
        `;
        list.appendChild(item);
    });
});

// Reactions
function sendReaction(emoji) {
    socket.emit('reaction', { room: currentRoom, emoji, username: currentUser });
    showReactionLocal(emoji);
}

function showReactionLocal(emoji) {
    const reaction = document.createElement('div');
    reaction.className = 'reaction-overlay';
    reaction.textContent = emoji;
    reaction.style.left = Math.random() * 80 + 10 + '%';
    document.getElementById('videoContainer').appendChild(reaction);
    setTimeout(() => reaction.remove(), 2000);
}

socket.on('reaction', (data) => {
    showReactionLocal(data.emoji);
});
