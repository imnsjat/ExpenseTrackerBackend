const mongoose = require('mongoose');

const DownloadedFileSchema = new mongoose.Schema({
    url: { type: String },
    date: { type: Date }
});

const DownloadedFile = mongoose.model('DownloadedFile', DownloadedFileSchema);

module.exports = DownloadedFile;
