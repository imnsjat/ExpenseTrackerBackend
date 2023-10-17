const express = require('express');
const authmiddleware = require('../middleware/auth')
const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/purchase/premium', authmiddleware.authenticate ,purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', authmiddleware.authenticate ,purchaseController.updateTransaction);


router.post('/purchase/updatetransactionfail', authmiddleware.authenticate ,purchaseController.updateTransactionFail);

module.exports = router ;