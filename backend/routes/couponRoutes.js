const express = require('express');
const { createCoupon, getCoupons, validateCoupon, updateCoupon, deleteCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

router.post('/validate', validateCoupon);
router.get('/active', getActiveCoupons);

module.exports = router;
