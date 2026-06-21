const express = require('express');
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Giriş yapmamış kullanıcıların erişmesini engellemek için /dashboard, /profile gibi sayfaları koruyun
router.get('/dashboard', protect, (req, res) => {
    res.send('Burda bi sik yok reis umarım githuba yüklerken burayı deiştirmeyi unutmam'); // Kullanıcı giriş yaptıysa bu sayfaya erişebilir
});

// Ana sayfa, giriş yapmış kullanıcılar için
router.get('/', protect, (req, res) => {
    res.render('index'); // Ana sayfayı render et
});

// Giriş yapmamış kullanıcıların signup ve login sayfalarına erişebilmesi için
// Eğer kullanıcı giriş yapmışsa, giriş sayfasına yönlendirme yapacağız
router.get('/signup', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/'); // Eğer giriş yapmışsa ana sayfaya yönlendir
    }
    res.render('signup'); // Signup sayfasını render et
});

router.post('/signup', signup);

// Giriş yapmamış kullanıcıların login sayfasına erişebilmesi için
// Eğer kullanıcı zaten giriş yapmışsa, login sayfasına gitmesine izin vermeyiz
router.get('/login', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/'); // Eğer giriş yapmışsa ana sayfaya yönlendir
    }
    res.render('login'); // Login sayfasını render et
});

// Çıkış işlemi (Token silme ve login sayfasına yönlendirme)
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Token'ı sil
    res.redirect('/login'); // Login sayfasına yönlendir
});

// Kullanıcı login işlemi
router.post('/login', login);

module.exports = router;
