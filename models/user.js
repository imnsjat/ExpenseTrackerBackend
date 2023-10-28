const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    ispremiumuser: { type: Boolean , default : false },
    totalexpenses: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;