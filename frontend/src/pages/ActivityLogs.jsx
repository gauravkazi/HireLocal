import { useState, useEffect } from 'react';
import API from '../api/axios';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/dashboard/admin/logs');
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">Activity Logs</h1>

      {logs.length === 0 ? (
        <p className="text-black dark:text-white text-sm">No activity recorded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map((log) => (
            <div
              key={log._id}
              className="border border-black dark:border-white rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-black dark:text-white">
                  <span className="font-medium">{log.user?.name}</span> ({log.user?.role}) —{' '}
                  {log.action}
                </p>
                {log.details && (
                  <p className="text-xs text-black dark:text-white mt-0.5">{log.details}</p>
                )}
              </div>
              <p className="text-xs text-black dark:text-white whitespace-nowrap ml-4">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;