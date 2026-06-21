const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Giriş yapma fonksiyonu
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kullanıcı zaten giriş yapmış mı kontrol et
        if (req.cookies.token) {
            return res.redirect('/'); // Eğer giriş yaptıysa ana sayfaya yönlendir
        }

        // Kullanıcıyı veritabanında ara
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { message: "Kullanıcı bulunamadı" });
        }

        // Şifreyi kontrol et
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { message: "Şifre yanlış" });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: user._id, username: user.username },  // Kullanıcı adı bilgisi burada ekleniyor
            'gizliAnahtar',  // Gizli anahtar (Bu, çevre değişkeninde saklanmalı)
            { expiresIn: '1h' }  // 1 saatlik geçerlilik süresi
        );

        // Token'ı cookie'ye kaydet
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 saat geçerlilik süresi

        // Giriş sonrası ana sayfaya yönlendir
        return res.redirect('/'); // Giriş yaptıktan sonra ana sayfaya yönlendir

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Bir hata oluştu', error: error.message });
    }
};

// Kayıt olma fonksiyonu
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kullanıcı zaten giriş yapmış mı kontrol et
        if (req.cookies.token) {
            return res.redirect('/'); // Eğer giriş yaptıysa ana sayfaya yönlendir
        }

        // Kullanıcıyı veritabanında ara
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup', { message: "Bu kullanıcı adı zaten mevcut." });
        }

        // Yeni kullanıcı oluştur
        const user = new User({ username, password });
        await user.save();

        // JWT token oluştur
        const token = jwt.sign({ id: user._id, username: user.username }, 'gizliAnahtar', { expiresIn: '1h' });

        // Token'ı cookie'ye kaydet
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 saat geçerlilik süresi

        // Kayıt sonrası login sayfasına yönlendir
        return res.redirect('/login'); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bir hata oluştu' });
    }
};
