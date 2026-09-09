import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function BrowseServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await API.get('/services', { params });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-1">Browse services</h1>
      <p className="text-sm text-black dark:text-white mb-4">Find a provider for your next project</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Search services"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-9 border border-black dark:border-white rounded px-2 text-black dark:text-white dark:bg-black"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 border border-black dark:border-white rounded px-2 text-black dark:text-white bg-white dark:bg-black"
        >
          <option value="">All categories</option>
          <option value="Website Development">Website Development</option>
          <option value="Logo Design">Logo Design</option>
          <option value="Social Media Management">Social Media Management</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="h-9 px-4 bg-black dark:bg-white text-white dark:text-black rounded text-sm"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-black dark:text-white text-sm">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-black dark:text-white text-sm">No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="border border-black dark:border-white rounded-lg p-4"
            >
              <p className="font-medium text-black dark:text-white text-sm mb-1">
                {service.title}
              </p>
              <p className="text-xs text-black dark:text-white mb-1">
                By {service.provider?.name}
              </p>
              <p className="text-xs text-black dark:text-white mb-3">
                NPR {service.price} · {service.deliveryTime}
              </p>
              <Link
                to={`/services/${service._id}`}
                className="block text-center w-full h-8 leading-8 bg-black dark:bg-white text-white dark:text-black rounded text-xs"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseServices;