const express = require('express');
const authmiddleware = require('../middleware/auth')
const expenseController = require('../controllers/expensecontroller');

const router = express.Router();

router.get('/app',expenseController.app);

router.post('/expenses', authmiddleware.authenticate , expenseController.postExpense);

router.get('/expenses', authmiddleware.authenticate , expenseController.getExpense);

router.post('/deleteexpense/', authmiddleware.authenticate , expenseController.deleteExpense);

module.exports =router ;