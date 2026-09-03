const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequest,
  getReceivedRequest,
  getRequestById,
  updateRequestStatus,
} = require('../controllers/requestController');

const { protect } = require('../middleware/authMiddleware');
const { ristrictTo } = require('../middleware/roleMiddleware');

router.post('/', protect, ristrictTo('customer'), createRequest);
router.get('/my-requests', protect, ristrictTo('customer'), getMyRequest);
router.get('/received-requests', protect, ristrictTo('provider'), getReceivedRequest);
router.get('/:id', protect, getRequestById);
router.put('/:id/status', protect, ristrictTo('provider'), updateRequestStatus);

module.exports = router;