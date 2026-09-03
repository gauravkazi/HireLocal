const express = require('express');
const router = express.Router();
const {
    createReview,
    getProviderReviews,
} = require('../controllers/reviewController');

const {protect} = require('../middleware/authMiddleware');
const {ristrictTo} =require('../middleware/roleMiddleware');

router.post('/', protect, ristrictTo('customer'), createReview);
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;