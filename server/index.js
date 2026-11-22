import { WebSocketServer } from 'ws';
import http from 'http';

const PORT = process.env.PORT || 3000;
const ROOM_CAPACITY = 6;
const TICK_RATE = 50; // 20 раза в секунду (~15-20 FPS)

class Room {
  constructor(code) {
    this.code = code;
    this.players = new Map(); // id -> { socket, x, y, z, rotY, speed, steer, carId, skin }
  }

  addPlayer(id, socket) {
    if (this.players.size >= ROOM_CAPACITY) return false;
    this.players.set(id, { socket, x: 0, y: 0, z: 0, rotY: 0, speed: 0, steer: 0, carId: 'rally_wrc', skin: 'stock' });
    return true;
  }

  removePlayer(id) {
    this.players.delete(id);
  }

  updatePlayer(id, data) {
    const p = this.players.get(id);
    if (!p) return;
    if (data.x !== undefined) p.x = data.x;
    if (data.y !== undefined) p.y = data.y;
    if (data.z !== undefined) p.z = data.z;
    if (data.rotY !== undefined) p.rotY = data.rotY;
    if (data.speed !== undefined) p.speed = data.speed;
    if (data.steer !== undefined) p.steer = data.steer;
    if (data.carId !== undefined) p.carId = data.carId;
    if (data.skin !== undefined) p.skin = data.skin;
  }

  getState() {
    const state = [];
    for (const [id, p] of this.players) {
      state.push({ id, x: p.x, y: p.y, z: p.z, rotY: p.rotY, speed: p.speed, steer: p.steer, carId: p.carId, skin: p.skin });
    }
    return state;
  }
}

const rooms = new Map(); // code -> Room
const playerRoom = new Map(); // playerId -> roomCode

// Генерация случайного кода комнаты (6 символов)
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const wss = new WebSocketServer({ noServer: true });

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  }
});

wss.on('connection', (ws) => {
  let playerId = null;
  let roomCode = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      
      switch (msg.type) {
        case 'create': {
          if (playerId) { ws.send(JSON.stringify({ type: 'error', message: 'Already in room' })); break; }
          const code = generateRoomCode();
          const room = new Room(code);
          rooms.set(code, room);
          playerId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          roomCode = code;
          playerRoom.set(playerId, code);
          room.addPlayer(playerId, ws);
          ws.send(JSON.stringify({ type: 'joined', playerId, roomCode, players: room.getState() }));
          break;
        }
        case 'join': {
          if (playerId) { ws.send(JSON.stringify({ type: 'error', message: 'Already in room' })); break; }
          const { code } = msg;
          const room = rooms.get(code.toUpperCase());
          if (!room) { ws.send(JSON.stringify({ type: 'error', message: 'Room not found' })); break; }
          playerId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          roomCode = code.toUpperCase();
          playerRoom.set(playerId, roomCode);
          if (room.addPlayer(playerId, ws)) {
            ws.send(JSON.stringify({ type: 'joined', playerId, roomCode, players: room.getState() }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Room full' }));
          }
          break;
        }
        case 'state': {
          if (!playerId) break;
          const room = rooms.get(roomCode);
          if (room) {
            room.updatePlayer(playerId, msg.data);
            // Рассылка всем в комнате, кроме отправителя
            const broadcast = { type: 'update', playerId, ...msg.data };
            for (const [pid, p] of room.players) {
              if (pid !== playerId && p.socket.readyState === 1) {
                p.socket.send(JSON.stringify(broadcast));
              }
            }
          }
          break;
        }
        case 'leave': {
          if (playerId && roomCode) {
            const room = rooms.get(roomCode);
            if (room) {
              room.removePlayer(playerId);
              // Удаляем комнату если пустая
              if (room.players.size === 0) {
                rooms.delete(roomCode);
              }
            }
            playerRoom.delete(playerId);
            playerId = null;
            roomCode = null;
          }
          break;
        }
      }
    } catch (e) {
      console.error('Message error:', e);
    }
  });

  ws.on('close', () => {
    if (playerId && roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        room.removePlayer(playerId);
        if (room.players.size === 0) {
          rooms.delete(roomCode);
        }
      }
      playerRoom.delete(playerId);
      playerId = null;
      roomCode = null;
    }
  });
});

// Тик-рассылка состояния комнат
setInterval(() => {
  const states = [];
  for (const [code, room] of rooms) {
    states.push({ code, players: room.getState() });
  }
  // Отправляем полное состояние всем клиентам каждую секунду
  // (остальные обновления приходят через state сообщения)
}, 1000);

// Тик обновления состояния 20 раз в секунду
setInterval(() => {
  for (const [code, room] of rooms) {
    for (const [id, p] of room.players) {
      if (p.socket.readyState === 1) {
        const state = room.getState();
        p.socket.send(JSON.stringify({ type: 'tick', state }));
      }
    }
  }
}, TICK_RATE);

server.listen(PORT, () => {
  console.log(`Rally Horizon Multiplayer Server on port ${PORT}`);
});
