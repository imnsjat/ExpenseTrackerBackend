const express = require('express');
const authmiddleware = require('../middleware/auth')
const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/premium/showleaderboard', authmiddleware.authenticate ,premiumController.showleaderboard);

// router.get('/user/download', authmiddleware.authenticate , authmiddleware.checkpremium ,premiumController.download);

// router.get('/expense/download/allurl',authmiddleware.authenticate ,authmiddleware.checkpremium , premiumController.allUrl)

module.exports = router ;