// =================================================================
// Live Chat System
// =================================================================
// Real-time chat using Firebase Realtime Database

const liveChat = {
    db: null,
    messagesRef: null,
    username: null,
    maxMessages: 100,
    isInitialized: false,
    chatOpen: false,
    unsubscribe: null,
    
    // Initialize chat system
    initialize() {
        if (this.isInitialized) return;
        
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            console.log('⏳ Waiting for Firebase...');
            setTimeout(() => this.initialize(), 1000);
            return;
        }
        
        try {
            this.db = firebase.database();
            this.messagesRef = this.db.ref('chat/messages');
            
            // Set up username
            this.setupUsername();
            
            // Create chat UI
            this.createChatUI();
            
            // Listen for messages
            this.listenForMessages();
            
            // Clean old messages periodically
            this.setupMessageCleanup();
            
            this.isInitialized = true;
            console.log('✅ Live Chat initialized');
            
        } catch (error) {
            console.error('❌ Error initializing chat:', error);
        }
    },
    
    // Set up username from save data or generate new one
    setupUsername() {
        // Try to get username from game state
        if (typeof gameState !== 'undefined' && gameState.playerName) {
            this.username = gameState.playerName;
        } else {
            // Generate random username
            const adjectives = ['Swift', 'Mystic', 'Shadow', 'Cosmic', 'Divine', 'Ancient', 'Crystal', 'Void', 'Storm', 'Flame'];
            const nouns = ['Hunter', 'Seeker', 'Warrior', 'Mage', 'Keeper', 'Wanderer', 'Sage', 'Knight', 'Ranger', 'Oracle'];
            this.username = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
        }
    },
    
    // Create chat UI
    createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'liveChatContainer';
        chatContainer.className = 'live-chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>💬 Live Chat</h3>
                <div class="chat-controls">
                    <button id="chatSettingsBtn" class="chat-btn" title="Chat Settings">⚙️</button>
                    <button id="toggleChatBtn" class="chat-btn" title="Minimize">−</button>
                </div>
            </div>
            <div class="chat-body">
                <div id="chatMessages" class="chat-messages"></div>
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chatInput" 
                        class="chat-input" 
                        placeholder="Type a message... (Enter to send)"
                        maxlength="200"
                    />
                    <button id="sendChatBtn" class="send-chat-btn">Send</button>
                </div>
            </div>
            <div class="chat-status">
                <span id="chatUsername" class="chat-username">You: ${this.username}</span>
                <span id="chatOnlineCount" class="chat-online">👥 ...</span>
            </div>
        `;
        
        document.body.appendChild(chatContainer);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Track online users
        this.trackOnlineUsers();
    },
    
    // Set up event listeners
    setupEventListeners() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendChatBtn');
        const toggleBtn = document.getElementById('toggleChatBtn');
        const settingsBtn = document.getElementById('chatSettingsBtn');
        
        // Send message on Enter or button click
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Toggle chat visibility
        toggleBtn.addEventListener('click', () => this.toggleChat());
        
        // Settings button
        settingsBtn.addEventListener('click', () => this.openSettings());
        
        // Load saved chat state
        const savedState = localStorage.getItem('chatOpen');
        if (savedState === 'false') {
            this.toggleChat();
        }
    },
    
    // Send message
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Check for spam (max 1 message per 2 seconds)
        const lastMessageTime = this.lastMessageTime || 0;
        const now = Date.now();
        if (now - lastMessageTime < 2000) {
            this.showNotification('⏰ Please wait before sending another message', 'warning');
            return;
        }
        
        this.lastMessageTime = now;
        
        // Create message object
        const messageData = {
            username: this.username,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            uid: this.getUserId()
        };
        
        // Send to Firebase
        this.messagesRef.push(messageData)
            .then(() => {
                input.value = '';
                console.log('✅ Message sent');
            })
            .catch((error) => {
                console.error('❌ Error sending message:', error);
                this.showNotification('Failed to send message', 'error');
            });
    },
    
    // Listen for new messages
    listenForMessages() {
        // Limit to last 50 messages
        const query = this.messagesRef.limitToLast(50);
        
        query.on('child_added', (snapshot) => {
            const message = snapshot.val();
            this.displayMessage(message);
        });
        
        // Handle message removal
        query.on('child_removed', (snapshot) => {
            const messageId = snapshot.key;
            const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
            if (messageElement) {
                messageElement.remove();
            }
        });
    },
    
    // Display message in chat
    displayMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        const isOwnMessage = message.username === this.username;
        if (isOwnMessage) {
            messageElement.classList.add('own-message');
        }
        
        // Format timestamp
        const time = new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Sanitize message text
        const sanitizedText = this.sanitizeHTML(message.text);
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-username">${this.sanitizeHTML(message.username)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${sanitizedText}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Limit displayed messages
        const messages = messagesContainer.querySelectorAll('.chat-message');
        if (messages.length > this.maxMessages) {
            messages[0].remove();
        }
    },
    
    // Track online users
    trackOnlineUsers() {
        const onlineRef = this.db.ref('chat/online');
        const userRef = onlineRef.push();
        const userId = this.getUserId();
        
        // Set user as online
        userRef.set({
            username: this.username,
            uid: userId,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Remove on disconnect
        userRef.onDisconnect().remove();
        
        // Listen for online count
        onlineRef.on('value', (snapshot) => {
            const count = snapshot.numChildren();
            const onlineElement = document.getElementById('chatOnlineCount');
            if (onlineElement) {
                onlineElement.textContent = `👥 ${count} online`;
            }
        });
    },
    
    // Set up automatic message cleanup
    setupMessageCleanup() {
        // Clean messages older than 24 hours every 5 minutes
        setInterval(() => {
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            this.messagesRef.orderByChild('timestamp')
                .endAt(oneDayAgo)
                .once('value', (snapshot) => {
                    const updates = {};
                    snapshot.forEach((child) => {
                        updates[child.key] = null;
                    });
                    
                    if (Object.keys(updates).length > 0) {
                        this.messagesRef.update(updates);
                        console.log(`🗑️ Cleaned ${Object.keys(updates).length} old messages`);
                    }
                });
        }, 5 * 60 * 1000); // Every 5 minutes
    },
    
    // Toggle chat visibility
    toggleChat() {
        const container = document.getElementById('liveChatContainer');
        const toggleBtn = document.getElementById('toggleChatBtn');
        
        this.chatOpen = !this.chatOpen;
        
        if (this.chatOpen) {
            container.classList.remove('minimized');
            toggleBtn.textContent = '−';
            toggleBtn.title = 'Minimize';
        } else {
            container.classList.add('minimized');
            toggleBtn.textContent = '+';
            toggleBtn.title = 'Maximize';
        }
        
        // Save state
        localStorage.setItem('chatOpen', this.chatOpen);
    },
    
    // Open chat settings
    openSettings() {
        const currentUsername = prompt('Enter your username:', this.username);
        if (currentUsername && currentUsername.trim()) {
            this.username = currentUsername.trim().substring(0, 20);
            document.getElementById('chatUsername').textContent = `You: ${this.username}`;
            localStorage.setItem('chatUsername', this.username);
            this.showNotification('✅ Username updated!', 'success');
        }
    },
    
    // Get unique user ID
    getUserId() {
        let uid = localStorage.getItem('chatUserId');
        if (!uid) {
            uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatUserId', uid);
        }
        return uid;
    },
    
    // Sanitize HTML to prevent XSS
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(message);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => liveChat.initialize(), 2000);
    });
} else {
    setTimeout(() => liveChat.initialize(), 2000);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.liveChat = liveChat;
}
