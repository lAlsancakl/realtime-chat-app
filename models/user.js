const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Şifreyi doğrulamak için comparePassword fonksiyonu
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Şifreyi hash'lemek için önceden işlemi
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
