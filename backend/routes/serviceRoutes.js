const express = require('express');
const router = express.Router();
const {
    createService,
    getAllServices,
    getServiceById,
    getMyService,
    updateService,
    deleteService,
} = require('../controllers/serviceController');
const {protect} = require('../middleware/authMiddleware');
const {ristrictTo} = require('../middleware/roleMiddleware');

router.get('/my-services', protect, ristrictTo('provider'), getMyService);
router.post('/', protect, ristrictTo('provider'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', protect, ristrictTo('provider'),updateService);
router.delete('/:id', protect, ristrictTo('provider'), deleteService);

module.exports = router;

