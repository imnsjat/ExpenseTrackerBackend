const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    paymentid: { type: String },
    orderid: { type: String },
    status: { type: String }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
