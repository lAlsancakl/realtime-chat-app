# Real-Time Chat Application (Alsancak Chat) 💬

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![Socket.io Version](https://img.shields.io/badge/Socket.io-4.x-black)](https://socket.io/)

Node.js, Express, Socket.io ve MongoDB kullanılarak geliştirilmiş, anlık mesajlaşma ve aktif kullanıcı takibi sunan gerçek zamanlı bir chat uygulaması. Temiz ve sade arayüzü sayesinde tarayıcılar arası hızlı ve kesintisiz iletişim sağlar.

## 🌟 Proje Görünümü

Uygulamanın aktif kullanıcı listesini, anlık mesajlaşma ekranını ve yazıyor... (typing) özelliğini gösteren arayüz görüntüsü:

![Alsancak Chat Application Screenshot](https://raw.githubusercontent.com/lAlsancakl/realtime-chat-app/main/image.png)

## ✨ Özellikler

* **⚡ Anlık Mesajlaşma:** WebSockets (Socket.io) sayesinde milisaniyeler içinde mesaj iletimi.
* **👥 Aktif Kullanıcı Listesi:** O an sohbet sitesine bağlı olan kullanıcıları canlı görme.
* **✏️ Yazıyor... İndikatörü:** Karşıdaki kullanıcı mesaj yazarken dinamik bildirim ("TestUser yazıyor...").
* **☁️ Mesaj Geçmişi:** Mesajların MongoDB veritabanında saklanması ve sayfayı yenileyince kaybolmaması.
* **🔒 Giriş ve Kayıt Sistemi:** Kullanıcıların hesap oluşturup güvenli şekilde giriş yapabilmesi.

## 🛠️ Kullanılan Teknolojiler

* **Backend:** Node.js, Express.js
* **Real-time:** Socket.io
* **Database:** MongoDB (Mongoose)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

## ⚙️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Projeyi Klonlayın:**
   ```bash
   git clone [https://github.com/lAlsancakl/realtime-chat-app.git](https://github.com/lAlsancakl/realtime-chat-app.git)
   cd realtime-chat-app
