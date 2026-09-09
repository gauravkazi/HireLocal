const express = require('express');
const router = express.Router();
const { 
    getCustomerDashboard, 
    getProviderDashboard,
    getAdmindashboard,
    getActivityLogs,
} = require('../controllers/dashboardController');
const {protect} = require('../middleware/authMiddleware');
const {ristrictTo} = require('../middleware/roleMiddleware');

router.get('/customer', protect, ristrictTo('customer'), getCustomerDashboard);
router.get('/provider', protect, ristrictTo('provider'), getProviderDashboard);
router.get('/admin', protect, ristrictTo('admin'), getAdmindashboard);
router.get('/admin/logs', protect, ristrictTo('admin'), getActivityLogs);

module.exports = router;