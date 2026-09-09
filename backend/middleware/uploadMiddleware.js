const multer = require('multer');
const {cloudinaryStorage, CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'HoreLocal',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{width:500, height:500, crop:'limit'}],
    },
});

const upload = multer({storage});

module.exports = upload;