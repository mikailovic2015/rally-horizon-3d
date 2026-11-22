// Мультиплеерный клиент — WebSocket с обработкой сообщений
export class MultiplayerClient {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.roomCode = null;
    this.isJoined = false;
    this.onMessage = null; // Callback для обработки сообщений от сервера
    this.connectionTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connectedServerUrl = null;
  }

  connect(serverUrl) {
    if (this.ws && this.ws.readyState <= 1) return;
    
    const protocol = serverUrl.includes('https') ? 'wss:' : 'ws:';
    const url = `${protocol}//${serverUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')}/ws`;
    
    this.ws = new WebSocket(url);
    this.connectedServerUrl = serverUrl;
    
    this.ws.onopen = () => {
      console.log('[MP] Подключено к:', url);
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (this.onMessage) this.onMessage(msg);
      } catch (e) {
        console.error('[MP] Ошибка парсинга:', e);
      }
    };
    
    this.ws.onclose = () => {
      console.warn('[MP] Отключен');
      this.isJoined = false;
      this.attemptReconnect(url);
    };
    
    this.ws.onerror = (err) => {
      console.error('[MP] Ошибка соединения');
    };
  }

  attemptReconnect(url) {
    clearTimeout(this.connectionTimeout);
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[MP] Переподключение... попытка ${this.reconnectAttempts}`);
      this.connectionTimeout = setTimeout(() => this.connect(url), 2000);
    }
  }

  createRoom() {
    if (!this.ws || this.ws.readyState !== 1) this.connect(this.connectedServerUrl || prompt('URL сервера:'));
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify({ type: 'create' }));
    }
  }

  joinRoom(code) {
    if (!this.ws || this.ws.readyState !== 1) this.connect(this.connectedServerUrl || prompt('URL сервера:'));
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify({ type: 'join', code: code.toUpperCase() }));
    }
  }

  sendState(carData) {
    if (!this.ws || this.ws.readyState !== 1 || !this.isJoined) return;
    this.ws.send(JSON.stringify({ type: 'state', data: carData }));
  }

  leave() {
    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'leave' }));
      this.ws.close();
    }
    this.ws = null;
    this.playerId = null;
    this.roomCode = null;
    this.isJoined = false;
  }

  getRemoteCars() {
    // Возвращает список удаленных игроков (для рендеринга в игре)
    // Реализуется на уровне игрока через onMessage
    return [];
  }
}
