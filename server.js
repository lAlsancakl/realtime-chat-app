const express      = require("express");
const socket       = require("socket.io");
const mongoose     = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt          = require("jsonwebtoken");

const Message    = require('./models/message'); 
const authRoutes = require('./routes/authRoutes');

const app = express();
const dbURL = "mongodb://dbURL";//MongoDB bağlantı URL'nizi buraya ekleyin

// Aktif kullanıcıları tutacak obje
let activeUsers = {};

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(dbURL, {
    serverSelectionTimeoutMS: 5000,
    family: 4 
})
.then(() => console.log("✅ MongoDB bağlantısı başarılı"))
.catch((err) => console.log("❌ MongoDB bağlantı hatası:", err.message));

app.use(authRoutes);

app.get("/", (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/login');
    }
    return res.render('index');
});

const server = app.listen(3001, "0.0.0.0", () => {
    console.log("🚀 Server 3001 portunda tüm ağlara açık!");
});

const io = socket(server);

io.on("connection", async (socket) => {
    
    // 1. GEÇMİŞ MESAJLAR
    try {
        const history = await Message.find().sort({ fullTimestamp: -1 }).limit(50);
        socket.emit("loadHistory", history.reverse());
    } catch (err) {
        console.error("❌ Geçmiş yükleme hatası:", err.message);
    }

    // 2. KULLANICI GİRİŞİ VE AKTİF LİSTE
    socket.on("getUsername", () => {
        try {
            const cookies = socket.handshake.headers.cookie;
            const tokenMatch = cookies?.match(/token=([^;]+)/);

            let username = "Misafir";
            if (tokenMatch) {
                const decoded = jwt.verify(tokenMatch[1], 'gizliAnahtar');
                username = decoded.username;
            }

            activeUsers[socket.id] = {
                username: username,
                status: "online"
            };

            socket.emit("sendUsername", username);
            io.emit("updateUserList", activeUsers);

        } catch (error) {
            socket.emit("sendUsername", "Hata!");
        }
    });

    // 3. DURUM GÜNCELLEME (Focus/Blur)
    socket.on("changeStatus", (status) => {
        if (activeUsers[socket.id]) {
            activeUsers[socket.id].status = status;
            io.emit("updateUserList", activeUsers);
        }
    });

    // 4. MESAJLAŞMA VE LOGLAMA
    socket.on("chat", async (data) => {
        if (data.sender && data.sender !== "Yükleniyor...") {
            try {
                const now = new Date();
                const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

                const logEntry = {
                    sender:    data.sender,
                    message:   data.message,
                    date:      now.toLocaleDateString('tr-TR'),
                    time:      now.toLocaleTimeString('tr-TR'),
                    socketId:  socket.id,
                    ipAddress: clientIp
                };

                const newMessage = new Message(logEntry);
                await newMessage.save();

                io.sockets.emit("chat", {
                    sender:  data.sender,
                    message: data.message,
                    time:    logEntry.time
                });

            } catch (err) {
                console.error("❌ Kayıt hatası:", err.message);
            }
        }
    });

    // 5. YAZIYOR KONTROLÜ
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });

    // 6. ÇIKIŞ
    socket.on("disconnect", () => {
        if (activeUsers[socket.id]) {
            delete activeUsers[socket.id];
            io.emit("updateUserList", activeUsers);
        }
    });
});