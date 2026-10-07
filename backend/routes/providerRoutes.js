const express = require('express');
const router = express.Router();
const { 
    createProviderProfile,
    updateProviderProfile,
    getMyProviderProfile,
    getProviderByUserId,
} = require('../controllers/providerController');

const {protect} = require('../middleware/authMiddleware');
const {ristrictTo} = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// provider create own profile

router.post('/profile', protect, ristrictTo('provider'), createProviderProfile);

// provider updates their profile

router.put('/profile', protect, ristrictTo('provider'), upload.single('profilePicture'), updateProviderProfile);

// provider get their profile

router.get('/profile', protect, ristrictTo('provider'), getMyProviderProfile);

//provider public profile by id

router.get('/user/:userId', getProviderByUserId);

module.exports = router;
