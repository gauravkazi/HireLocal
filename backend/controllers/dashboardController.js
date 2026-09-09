const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Service = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');

// get customer dashboard

const getCustomerDashboard = async(req, res)=>{
    try{
        const customerId = req.user._id;

        const activeRequests =  await ServiceRequest.find({
            customer: customerId,
            status: {$in:['Pending', 'In Progress', 'Completed']},
        })
        .populate('provider', 'name email')
        .populate('service', 'title category price');

        //prohect delivered

        const completedProjects = await ServiceRequest.find({
            customer:customerId,
            status:'Delivered',
        })
        .populate('provider', 'name emial')
        .populate('service', 'title category price');

        // basic info

        const profile = await User.findById(customerId).select('-password');

        res.status(200).json({
            profile,
            activeRequestsCount: activeRequests.length,
            completedProjectsCount:  completedProjects.length,
            activeRequests,
            completedProjects,
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//get provider dashboard
const getProviderDashboard = async(req, res) =>{
    try{
        const provider = req.user._id;

        // pending request

        const pendingRequests = await ServiceRequest.find({
            provider:provider,
            status:'Pending',
        })
        .populate('provider', 'name, email')
        .populate('service', 'title category price');
        
        //active project

        const activeProjects = await ServiceRequest.find({
            provider:provider,
            status:{$in:['Accepted', 'In Progress', 'Completed']},
        })
        .populate('customer', 'name email')
        .populate('servcie', 'title category price');

        // Earnings

        const delivereRequests =  await ServiceRequest.find({
            provider: provider,
            status:'Delivered'
        });
        const totalEarnings = delivereRequests.reduce((sum, r) => sum + r.budget, 0);
        res.status(200).json({
            pendingRequestCount: pendingRequests.length,
            activeProjectsCount: activeProjects.length,
            totalEarnings,
            pendingRequests,
            activeProjects,
        });

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// admin sashboard

const getAdmindashboard = async(req, res) =>{
    try{
        // user status

        const totalUsers = await User.countDocuments();
        const totalCustomer = await User.countDocuments({role:'customer'});
        const totalProvider = await User.countDocuments({role: 'provider'});

        // service status
        const totalServices = await Service.countDocuments();

        // project status

        const totalRequests = await ServiceRequest.countDocuments();
        const pendingCount = await ServiceRequest.countDocuments({status:'Pending'});
        const inProgressCount = await ServiceRequest.countDocuments({status:'In Progress'});
        const deliveredCount = await ServiceRequest.countDocuments({status:'Delivered'});

        res.status(200).json({
            userStats:{
                totalUsers,
                totalCustomer,
                totalProvider,
            },
            serviceStats:{
                totalServices,
            },
            projectStats:{
                totalRequests,
                pendingCount,
                inProgressCount,
                deliveredCount,
            },
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

// activity log
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {getCustomerDashboard, getProviderDashboard, getAdmindashboard, getActivityLogs};