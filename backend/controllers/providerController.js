const ProviderProfile = require('../models/ProviderProfile');

// create provider profile
const createProviderProfile = async(req, res)=>{
    try{
        const{bio, skills, experience, pricing, portfolio, profilePicture} = req.body;

        // check if profile already exist for the user 

        const existingProfile = await ProviderProfile.findOne({user: req.user._id});
        if(existingProfile){
            return res.status(400).json({message:'Provider Profile already exits'})
        }
        const profile = await ProviderProfile.create({
            user: req.user._id,
            bio,
            skills,
            experience,
            pricing,
            portfolio,
            profilePicture,
        });
        res.status(201).json({profile});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
};
// update provider profile

const updateProviderProfile = async(req,res)=>{
    try{
        const profile = await ProviderProfile.findOne({user:req.user._id});
        if(!profile){
            return res.status(404).json({message: 'Provider Profile not found'});
        }
        const {bio, skills, experience, pricing, portfolio, profilePicture} = req.body;
        profile.bio = bio ?? profile.bio;
        profile.skills = skills ?? profile.skills;
        profile.experience = experience ?? profile.experience;
        profile.pricing = pricing?? profile.pricing;
        profile.portfolio = portfolio ?? profile.portfolio;
        profile.profilePicture = profilePicture ?? profile.profilePicture;

        // if a new file was upload use its cloudinary url
        if(req.file){
            profile.profilePicture = req.file.path;
        }

        const updateProfile = await profile.save();
        res.status(200).json(updateProfile);
        
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// login provider profile
 
const getMyProviderProfile = async(req,res)=>{
    try{
        const profile = await ProviderProfile.findOne({user:req.user._id}).populate('user', 'name email role');
        if(!profile){
            return res.status(404).json({message:'Provider Profile not found'});
        }
        res.status(200).json(profile);

    }catch(error){
        res.status(500).json({message:error.message});
    }

};

// public provider profile by id 

const getProviderByUserId = async (req,res)=>{
    try{
        const profile = await ProviderProfile.findOne({user: req.params.userId}).populate(
            'user',
            'name email role'
        );
        if(!profile){
            return res.status(404).json({message:'Provider Profile not found'});
        }
        res.status(200).json(profile);
    } catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports ={
    createProviderProfile,
    updateProviderProfile,
    getMyProviderProfile,
    getProviderByUserId,
};