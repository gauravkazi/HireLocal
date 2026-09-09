import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      const res = await API.get(`/services/${id}`);
      setService(res.data);
    };
    fetchService();
  }, [id]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await API.post('/requests', {
        serviceId: id,
        requirements,
        budget,
        deadline,
      });
      setMessage('Request submitted successfully!');
      setRequirements('');
      setBudget('');
      setDeadline('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit request');
    }
  };

  if (!service) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 max-w-2xl mx-auto">
      <div className="border border-black dark:border-white rounded-lg p-6 mb-6">
        <h1 className="text-xl font-semibold text-black dark:text-white mb-2">{service.title}</h1>
        <p className="text-sm text-black dark:text-white mb-1">By {service.provider?.name}</p>
        <p className="text-sm text-black dark:text-white mb-3">{service.category}</p>
        <p className="text-sm text-black dark:text-white mb-1">NPR {service.price}</p>
        <p className="text-sm text-black dark:text-white mb-4">Delivery: {service.deliveryTime}</p>
        <p className="text-sm text-black dark:text-white">{service.description}</p>
      </div>

      {user && user.role === 'customer' && (
        <form onSubmit={handleRequest} className="border border-black dark:border-white rounded-lg p-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-3">Request this service</h2>

          {message && (
            <p className={`text-sm mb-3 font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <label className="text-sm text-black dark:text-white block mb-1">Requirements</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full border border-black dark:border-white rounded px-2 py-1 mb-3 text-black dark:text-white dark:bg-black"
            rows="3"
            required
          />

          <label className="text-sm text-black dark:text-white block mb-1">Budget (NPR)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
            required
          />

          <label className="text-sm text-black dark:text-white block mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-4 text-black dark:text-white dark:bg-black"
            required
          />

          <button
            type="submit"
            className="w-full h-9 bg-black dark:bg-white text-white dark:text-black rounded text-sm"
          >
            Submit Request
          </button>
        </form>
      )}

      {!user && (
        <p className="text-sm text-black dark:text-white">Log in as a customer to request this service.</p>
      )}
    </div>
  );
}

export default ServiceDetail;