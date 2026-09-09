const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema(
    {
        provider:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
            enum:[
                'Website Development',
                'Logo Design',
                'Social Media Management',
                'Content Writing',
                'Digital Marketing',
                'Other',
            ],
        },
        price:{
            type:Number,
            required:true,
        },
        deliveryTime:{
            type:String,
            required:true,
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model('Service', serviceSchema );