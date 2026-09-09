import { useState, useEffect } from 'react';
import API from '../api/axios';

const STATUS_OPTIONS = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Delivered'];

function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get('/requests/received-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/requests/${id}/status`, { status: newStatus });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">Received Requests</h1>

      {requests.length === 0 ? (
        <p className="text-black dark:text-white text-sm">No requests received yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div key={req._id} className="border border-black dark:border-white rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-black dark:text-white text-sm">{req.service?.title}</p>
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  className="text-xs border border-black dark:border-white rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-black"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-black dark:text-white mb-1">Customer: {req.customer?.name}</p>
              <p className="text-xs text-black dark:text-white mb-1">Budget: NPR {req.budget}</p>
              <p className="text-xs text-black dark:text-white mb-1">
                Deadline: {new Date(req.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-black dark:text-white">Requirements: {req.requirements}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceivedRequests;