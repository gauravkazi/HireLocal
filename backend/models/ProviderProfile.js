const mongoose = require('mongoose');
const ProviderProfileSchema = new mongoose.Schema(
{
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bio:{
        type:String,
        default:'',
        trim:true,
    },
    skills:{
        type:[String],
        default:'',

    },
    experience:{
        type:String,
        default:'',

    },
    pricing:{
        type:Number,
        default:0,
    },
    portfolio:[
        {
            title:{type:String, required: true},
            description:{type:String, deafult:''},
            imageUrl: {type: String, default:''},

        },
    ],
    profilePicture:{
        type:String,
        default:'',
    },
    averageRating:{
        type: Number,
        default:0,
    },

},
{timestamps: true}
);
module.exports = mongoose.model ('ProviderProfile', ProviderProfileSchema);