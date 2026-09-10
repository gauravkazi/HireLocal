const ServiceRequest = require('../models/ServiceRequest');
const Service = require('../models/Service');
const logActivity = require('../utils/logActivity');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Customer submits a service request
const createRequest = async (req, res) => {
  try {
    const { serviceId, requirements, budget, deadline } = req.body;

    if (!serviceId || !requirements || !budget || !deadline) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const request = await ServiceRequest.create({
      customer: req.user._id,
      provider: service.provider,
      service: serviceId,
      requirements,
      budget,
      deadline,
    });

    const provider = await User.findById(service.provider);
    if (provider) {
      await sendEmail(
      provider.email,
      'New Service Request — HireLocal',
      `You received a new request for "${service.title}".\n\nRequirements: ${requirements}\nBudget: NPR ${budget}\nDeadline: ${deadline}\n\nLog in to HireLocal to respond.`
      );
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests made by the logged-in customer
const getMyRequest = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate('provider', 'name email')
      .populate('service', 'title category price');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get all requests received by the logged-in provider
const getReceivedRequest = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ provider: req.user._id })
      .populate('customer', 'name email')
      .populate('service', 'title category price');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single request by ID
const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title category price');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const isCustomer = request.customer._id.toString() === req.user._id.toString();
    const isProvider = request.provider._id.toString() === req.user._id.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized to view' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (project tracking)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    const updatedRequest = await request.save();


    const customer = await User.findById(request.customer);
    if (customer) {
      await sendEmail(
        customer.email,
        'Your Request Status Has Changed — HireLocal',
        `Your request status has been updated to: ${status}.\n\nLog in to HireLocal to view details.`
      );
    }

    await logActivity(req.user._id, 'Request status updated', `Status: ${status}`);

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequest,
  getReceivedRequest,
  getRequestById,
  updateRequestStatus,
};