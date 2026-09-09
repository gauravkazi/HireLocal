const Service = require('../models/Service');
const logActivity = require('../utils/logActivity');

// create a new service listing 

const createService = async(req, res) =>{
    try{
        const {title, description, category, price, deliveryTime} = req.body;
        if(!title || !description || !category || !price || !deliveryTime){
            return res.status(400).json({message:'please fill all filed'});
        }
        const service = await Service.create({
            provider:req.user._id,
            title,
            description,
            category,
            price,
            deliveryTime,
        });

        await logActivity(req.user._id, 'Service created', service.title);
        res.status(201).json(service);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// get all service 

const getAllServices = async(req,res)=>{
    try{
        const {category, search} = req.query;
        const filter = {};

        if(category){
            filter.category = category;
        }
        if(search){
            filter.title = {$regex: search, $options:'i'}; 
        }

        const services = await Service.find(filter).populate('provider','name email');
        res.status(200).json(services);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// get single service by id

const getServiceById = async(req,res)=>{
    try{
        const service = await Service.findById(req.params.id).populate('provider', 'name email');
        if(!service){
            return res.status(404).json({message:'service not found'});
        }
        res.status(200).json(service);

    }catch (error){
        res.status(500).json({message:error.message});
    }
};

// get all service created 

const getMyService = async(req, res)=>{
    try{
        const service = await Service.find({provider:req.user._id});
        res.status(200).json(service);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// update servcie listing 

const updateService = async(req, res)=>{
    try{
        const service = await Service.findById(req.params.id);
        if(!service){
            return res.status(404).json({message:'service not found'});
        }
        if(service.provider.toString () !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized to update'});
        }
        const {title, description, category, price, deliveryTime} = req.body;
        service.title = title ?? service.title;
        service.description = description ?? service.description;
        service.category = category ?? service.category;
        service.price = price ?? service.price;
        service.deliveryTime = deliveryTime ?? service.deliveryTime;

        const updateService = await service.save();
        res.status(200).json(updateService);

    }catch(error){
        res.status(500).json({message:error.message});
    }
};


// delete a service listing

const deleteService = async(req, res)=>{
    try{
        const service = await Service.findById(req.params.id);
        if(!service){
            return res.status(404).json({message:'service not found'});
        }
        if(service.provider.toString () !== req.user._id.toString()){
            return res.status(403).json({message:'not authorized to delete'});
        }
        await service.deleteOne();
        res.status(200).json({message:'service delete successfully'});

    }catch(error){
        res.status(500).json({message:error.messaeg});
    }
};
module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getMyService,
    updateService,
    deleteService,
};