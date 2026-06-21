// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login'); // Token yoksa login sayfasına yönlendir
    }

    try {
        const decoded = jwt.verify(token, 'gizliAnahtar');
        req.user = decoded; // Kullanıcı bilgilerini isteğe ekleyin
        next();
    } catch (error) {
        console.log(error);
        res.clearCookie('token'); // Geçersiz token varsa sil
        return res.redirect('/login'); // Login sayfasına yönlendir
    }
};