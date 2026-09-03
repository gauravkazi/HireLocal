const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
    {
        customer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        provider:{
            type: mongoose.Schema.Types.ObjectId,
            refL:'User',
            required:true,
        },
        request:{
            type: mongoose.Schema.Types.ObjectId,
            refL:'User',
            required:true,
            unique:true,
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5,
        },

        feedback:{
            type:String,
            default:'',
        },
    },
);

module.exports = mongoose.model('Review',reviewSchema);