const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async(req,res,next) =>{
    
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token form header: bearer
            token = req.headers.authorization.split(' ')[1];
            // verify token 
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            // attach user to request
            req.user = await User.findById(decode.id).select('-password');
            next(); // move to the actual route handler

        }catch(error){
            res.status(401).json({message:'Not authorized, token failed '});
        }
    }
    if(!token){
        res.status(401).json({message:'Not authorized, no token'});
    }
};
module.exports = {protect};