// =================================================================
// Live Chat System - Local Backend Integration
// =================================================================

const liveChat = {
    backendUrl: window.BACKEND_URL || 'http://localhost:8090',
    username: null,
    maxMessages: 50,
    isInitialized: false,
    chatOpen: false,
    pollInterval: null,
    lastMessageId: 0,
    
    // Initialize chat system
    initialize() {
        if (this.isInitialized) return;
        
        // Get player name from localStorage or gameState
        const playerName = localStorage.getItem('playerName') || 
                          (typeof gameState !== 'undefined' ? gameState.playerName : null);
        
        // Wait for player name to be set
        if (!playerName || playerName === 'Anonymous') {
            console.log('⏳ Waiting for player name...');
            setTimeout(() => this.initialize(), 500);
            return;
        }
        
        try {
            // Get username from player name
            this.username = playerName;
            
            // Create chat UI
            this.createChatUI();
            
            this.isInitialized = true;
            console.log('✅ Live Chat initialized for:', this.username);
            
        } catch (error) {
            console.error('❌ Error initializing chat:', error);
        }
    },
    
    // Create chat UI
    createChatUI() {
        const chatHTML = `
            <div id="liveChatContainer" class="live-chat-container">
                <div class="live-chat-toggle" onclick="liveChat.toggleChat()">
                    <span class="chat-icon">💬</span>
                    <span class="chat-label">Chat</span>
                    <span class="unread-badge" id="unreadBadge" style="display: none;">0</span>
                </div>
                <div class="live-chat-window" id="liveChatWindow">
                    <div class="chat-header">
                        <h3>💬 Live Chat</h3>
                        <button class="chat-close" onclick="liveChat.toggleChat()">✕</button>
                    </div>
                    <div class="chat-messages" id="chatMessages"></div>
                    <div class="chat-input-container">
                        <input type="text" 
                               id="chatInput" 
                               class="chat-input" 
                               placeholder="Type a message..." 
                               maxlength="200"
                               onkeypress="if(event.key==='Enter')liveChat.sendMessage()">
                        <button class="chat-send-btn" onclick="liveChat.sendMessage()">Send</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    },
    
    // Toggle chat window
    toggleChat() {
        this.chatOpen = !this.chatOpen;
        const chatWindow = document.getElementById('liveChatWindow');
        const unreadBadge = document.getElementById('unreadBadge');
        
        if (this.chatOpen) {
            // Update username when opening chat (in case it changed)
            this.username = localStorage.getItem('playerName') || 
                           (typeof gameState !== 'undefined' ? gameState.playerName : 'Anonymous');
            
            chatWindow.style.display = 'flex';
            unreadBadge.style.display = 'none';
            unreadBadge.textContent = '0';
            
            // Start polling for messages
            this.startPolling();
            
            // Load initial messages
            this.loadMessages();
            
            // Scroll to bottom
            setTimeout(() => this.scrollToBottom(), 100);
        } else {
            chatWindow.style.display = 'none';
            
            // Stop polling
            this.stopPolling();
        }
    },
    
    // Start polling for new messages
    startPolling() {
        if (this.pollInterval) return;
        
        this.pollInterval = setInterval(() => {
            this.loadMessages(true);
        }, 2000); // Poll every 2 seconds
    },
    
    // Stop polling
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },
    
    // Load messages from backend
    async loadMessages(isUpdate = false) {
        try {
            const response = await fetch(`${this.backendUrl}/chat/messages?limit=${this.maxMessages}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            
            if (!response.ok) return;
            
            const data = await response.json();
            const messages = data.messages || [];
            
            if (messages.length === 0) return;
            
            const messagesContainer = document.getElementById('chatMessages');
            if (!messagesContainer) return;
            
            // Check for new messages
            const latestId = messages[messages.length - 1]?.id || 0;
            const hasNewMessages = latestId > this.lastMessageId;
            
            if (isUpdate && hasNewMessages && !this.chatOpen) {
                // Show unread badge
                const unreadBadge = document.getElementById('unreadBadge');
                const currentUnread = parseInt(unreadBadge.textContent) || 0;
                const newCount = messages.filter(m => m.id > this.lastMessageId).length;
                unreadBadge.textContent = currentUnread + newCount;
                unreadBadge.style.display = 'flex';
            }
            
            this.lastMessageId = latestId;
            
            // Render messages
            messagesContainer.innerHTML = messages.map(msg => this.renderMessage(msg)).join('');
            
            // Scroll to bottom if chat is open
            if (this.chatOpen && hasNewMessages) {
                this.scrollToBottom();
            }
            
        } catch (error) {
            console.error('❌ Error loading messages:', error);
        }
    },
    
    // Render a single message
    renderMessage(msg) {
        const isOwn = msg.username === this.username;
        const time = new Date(msg.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="chat-message ${isOwn ? 'own-message' : ''}">
                <div class="message-header">
                    <span class="message-username">${this.escapeHtml(msg.username)}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-content">${this.escapeHtml(msg.message)}</div>
            </div>
        `;
    },
    
    // Send a message
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Update username before sending
        this.username = localStorage.getItem('playerName') || 
                       (typeof gameState !== 'undefined' ? gameState.playerName : 'Anonymous');
        
        try {
            const response = await fetch(`${this.backendUrl}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    username: this.username,
                    message: message
                })
            });
            
            if (response.ok) {
                input.value = '';
                // Immediately load messages to show sent message
                await this.loadMessages();
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to send message:', response.status, errorText);
            }
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
        }
    },
    
    // Scroll to bottom of messages
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => liveChat.initialize(), 1000);
    });
} else {
    setTimeout(() => liveChat.initialize(), 1000);
}

console.log('✅ Live Chat System loaded');
