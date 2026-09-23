const express = require('express');
const { getOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Because the creation of order is currently in server.js directly, we only map the new endpoints here.
// In a real refactoring, POST /api/orders would move here too.
router.get('/', protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
