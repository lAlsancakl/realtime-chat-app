/**
 * ALSANCAK CHAT SYSTEM - FRONTEND LOGIC
 */
const message     = document.getElementById("message");
const submitBtn   = document.getElementById("submitBtn");
const output      = document.getElementById("output");
const feedback    = document.getElementById("feedback");
const chatWindow  = document.getElementById("chat-window");
const userList    = document.getElementById("user-list");

let tempHistory   = null;

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Mesaj kutularının düzgün görünmesi için yardımcı fonksiyon
 */
function appendMessage(data, myUsername) {
    const isMe = data.sender === myUsername;
    const messageClass = isMe ? 'my-message' : '';
    const timeStr = data.time ? `<span class="msg-time" style="display:block; font-size:10px; opacity:0.6; text-align:right; margin-top:4px;">${data.time}</span>` : '';

    // BUG FIX: Mesajları bir div (message-row) içine alıyoruz ki float'lar birbirine girmesin
    const messageHTML = `
        <div class="message-row" style="width: 100%; display: flow-root; margin-bottom: 10px;">
            <p class="${messageClass}" style="max-width: 80%; padding: 10px 15px; border-radius: 10px; margin: 0; position: relative; ${isMe ? 'float: right; background: #0085ad; color: #fff;' : 'float: left; background: #f1f1f1; color: #333;'}">
                <strong style="display: block; font-size: 11px; margin-bottom: 3px;">${data.sender}</strong>
                ${data.message}
                ${timeStr}
            </p>
        </div>
    `;
    output.innerHTML += messageHTML;
    scrollToBottom();
}

function displayHistory(history) {
    output.innerHTML = "";
    const myUsername = document.getElementById('sender').value;
    history.forEach(data => appendMessage(data, myUsername));
}

// Socket: Geçmiş
socket.on("loadHistory", (history) => {
    tempHistory = history;
    const myUsername = document.getElementById('sender').value;
    if (myUsername !== "Yükleniyor...") displayHistory(tempHistory);
});

// Socket: Yeni Mesaj
socket.on("chat", (data) => {
    const myUsername = document.getElementById('sender').value;
    
    // Mesaj geldiğinde eğer yazan kişi buysa "yazıyor" kısmını temizle
    if (feedback.innerText.includes(data.sender)) {
        feedback.innerHTML = "";
    }
    
    appendMessage(data, myUsername);
});

// Socket: Yazıyor... (Bug Çözümü: Sadece karşıdakini göster)
socket.on("typing", (data) => {
    const myUsername = document.getElementById('sender').value;
    if (data.isTyping && data.sender !== myUsername) {
        feedback.innerHTML = `<p style="font-size: 13px; color: #666;"><em>${data.sender} yazıyor...</em></p>`;
    } else if (!data.isTyping) {
        feedback.innerHTML = "";
    }
});

/**
 * Socket: Aktifler (HİÇ DOKUNULMADI - Orijinal Hali)
 */
socket.on("updateUserList", (users) => {
    if (!userList) return;
    userList.innerHTML = ""; 
    Object.values(users).forEach(user => {
        const statusClass = (user.status === "online") ? "status-online" : "status-offline";
        userList.innerHTML += `<li><span class="status-dot ${statusClass}"></span>${user.username}</li>`;
    });
});

// Gönder Olayı
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const msg = message.value.trim();
    const sender = document.getElementById('sender').value;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (msg !== "") {
        socket.emit("chat", { message: msg, sender: sender, time: time });
        message.value = "";
        socket.emit("typing", { sender: sender, isTyping: false });
    }
});

message.addEventListener("keydown", (e) => { if (e.key === "Enter") submitBtn.click(); });

message.addEventListener("input", () => {
    const sender = document.getElementById('sender').value;
    socket.emit("typing", { sender: sender, isTyping: message.value.trim().length > 0 });
});

window.addEventListener("focus", () => socket.emit("changeStatus", "online"));
window.addEventListener("blur", () => socket.emit("changeStatus", "offline"));

socket.emit("getUsername");
socket.on("sendUsername", (username) => {
    document.getElementById('sender').value = username;
    if (tempHistory) displayHistory(tempHistory);
});