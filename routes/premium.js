const express = require('express');
const authmiddleware = require('../middleware/auth')
const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/premium/showleaderboard', authmiddleware.authenticate ,premiumController.showleaderboard);

module.exports = router ;