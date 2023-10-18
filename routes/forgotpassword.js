const express = require('express');
const forgotcontroller = require('../controllers/forgotcontroller');

const router = express.Router();

router.get('/forgotpassword',forgotcontroller.home);

router.post('/password/forgotpassword',forgotcontroller.forgotpassword)

// router.post('/forgotlogin',authcontroller.login)

module.exports = router ;