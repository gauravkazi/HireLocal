const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// register new user
const registerUser = async (req,res) =>{
    try{
        const {name, email,password, role} = req.body;
        // check if required field

        if(!name || !email || !password){
            res.status(400).json({message:'please fill all fields'});
        }
        // check if user already exists
        const userExists = await User.findOne ({email});
        if(userExists) {
           return res.status(400).json({
            message: 'user already exists'
           });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role: role || 'customer',
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch(error){
        res.status(500).json({message:error.message});
    }
};

// login User

const loginUser = async(req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'please fill all filed'});
        }

        // find user
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:'Invalid credentials!'});
        }
        // compare poassword

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role:user.role,
            token:generateToken(user._id),
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports = {registerUser, loginUser};
