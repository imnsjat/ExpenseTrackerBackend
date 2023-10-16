const express = require('express');

const expenseController = require('../controllers/expensecontroller');

const router = express.Router();

router.get('/app',expenseController.app);

router.post('/expenses',expenseController.postExpense);

router.get('/expenses',expenseController.getExpense);

router.post('/deleteexpense/',expenseController.deleteExpense);

module.exports =router ;