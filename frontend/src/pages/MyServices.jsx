import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Website Development');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [message, setMessage] = useState('');

  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const res = await API.get('/services/my-services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await API.post('/services', { title, description, category, price, deliveryTime });
      setMessage('Service created successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setShowForm(false);
      fetchMyServices();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      fetchMyServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-black dark:text-white">My Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 bg-black dark:bg-white text-white dark:text-black rounded text-sm"
        >
          {showForm ? 'Cancel' : '+ New Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-black dark:border-white rounded-lg p-4 mb-6">
          {message && <p className="text-sm text-green-600 mb-3">{message}</p>}

          <label className="text-sm text-black dark:text-white block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
            required
          />

          <label className="text-sm text-black dark:text-white block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-black dark:border-white rounded px-2 py-1 mb-3 text-black dark:text-white dark:bg-black"
            rows="3"
            required
          />

          <label className="text-sm text-black dark:text-white block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white bg-white dark:bg-black"
          >
            <option value="Website Development">Website Development</option>
            <option value="Logo Design">Logo Design</option>
            <option value="Social Media Management">Social Media Management</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Other">Other</option>
          </select>

          <label className="text-sm text-black dark:text-white block mb-1">Price (NPR)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
            required
          />

          <label className="text-sm text-black dark:text-white block mb-1">Delivery Time</label>
          <input
            type="text"
            placeholder="e.g. 3 days"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full h-9 border border-black dark:border-white rounded px-2 mb-4 text-black dark:text-white dark:bg-black"
            required
          />

          <button type="submit" className="w-full h-9 bg-black dark:bg-white text-white dark:text-black rounded text-sm">
            Create Service
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-black dark:text-white text-sm">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-black dark:text-white text-sm">You haven't created any services yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <div key={service._id} className="border border-black dark:border-white rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-black dark:text-white text-sm">{service.title}</p>
                <p className="text-xs text-black dark:text-white">{service.category} · NPR {service.price} · {service.deliveryTime}</p>
              </div>
              <button
                onClick={() => handleDelete(service._id)}
                className="text-xs border border-black dark:border-white rounded px-3 py-1 text-black dark:text-white"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyServices;