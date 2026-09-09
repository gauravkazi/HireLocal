import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/requests/my-requests');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">My Requests</h1>

      {requests.length === 0 ? (
        <p className="text-black dark:text-white text-sm">You haven't submitted any requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div key={req._id} className="border border-black dark:border-white rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-black dark:text-white text-sm">
                  {req.service?.title}
                </p>
                <span className="text-xs border border-black dark:border-white rounded px-2 py-0.5 text-black dark:text-white">
                  {req.status}
                </span>
              </div>
              <p className="text-xs text-black dark:text-white mb-1">
                Provider: {req.provider?.name}
              </p>
              <p className="text-xs text-black dark:text-white mb-1">
                Budget: NPR {req.budget}
              </p>
              <p className="text-xs text-black dark:text-white mb-1">
                Deadline: {new Date(req.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-black dark:text-white">
                Requirements: {req.requirements}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;