const mongoose = require('mongoose');

const ForgotPasswordSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true }
});

const ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema);

module.exports = ForgotPassword;
