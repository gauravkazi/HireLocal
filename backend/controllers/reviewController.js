const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const ProviderProfile = require('../models/ProviderProfile');

// create a review request

const createReview = async(req, res)=>{
try{
    const {requestId, rating, feedback} = req.body;

    if(!requestId || !rating){
        return res.status(400).json({message:'please fill all the field'});
    }
    // find the request
    const request = await ServiceRequest.findById(requestId);
    if(!request){
        return res.status(404).json({message:'Request not found'});
    }

    // only the costumer who make the rrquest
    if(request.customer.toString() !== request.customer.toString()){
        return res.status(403).json({message:'Not authorized'});
    }
    // only allow review on delivered
    if(request.status !== 'Delivered'){
        return res.status(400).json({message:'Only review a delivered request'});
    }

    // check for duplicate request
    const existingReview = await Review.findOne({request:requestId});
    if(existingReview){
        return res.status(400).json({message:'You have already review this request'});
    }

    const review = await Review.create({
        customer: req.user._id,
        provider: request.provider,
        request: requestId,
        rating,
        feedback,

    });

    const allReviews = await Review.find({provider:request.provider});
    const avgRating = allReviews.reduce((sum, r) => sum + r .rating, 0) / allReviews.length;
    
    await ProviderProfile.findOneAndUpdate(
            {user:'request.provider'},
            {averageRating: avgRating.toFixed(1)}  
    );
    res.status(201).json(review);   
   } catch(error){
    res.status(500).json({message:error.message});
   }

};


// get all review 

const getProviderReviews = async(req, res)=>{
    try{
        const reviews = await Review.find({
            provider:req.params.providerId
        }).populate(
            'customer',
            'name'
        );
        res.status(200).json(reviews);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports = {
    createReview,
    getProviderReviews,
};