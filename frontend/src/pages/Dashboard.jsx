import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get(`/dashboard/${user.role}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;
  if (!data) return <p className="text-black dark:text-white p-6">No dashboard data available.</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">Dashboard</h1>

      {user.role === 'customer' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Active Requests" value={data.activeRequestsCount} />
          <StatCard label="Completed Projects" value={data.completedProjectsCount} />
        </div>
      )}

      {user.role === 'provider' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pending Requests" value={data.pendingRequestCount} />
          <StatCard label="Active Projects" value={data.activeProjectsCount} />
          <StatCard label="Total Earnings" value={`NPR ${data.totalEarnings}`} />
        </div>
      )}

      {user.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={data.userStats?.totalUsers} />
          <StatCard label="Customers" value={data.userStats?.totalCustomer} />
          <StatCard label="Providers" value={data.userStats?.totalProvider} />
          <StatCard label="Total Services" value={data.serviceStats?.totalServices} />
          <StatCard label="Total Requests" value={data.projectStats?.totalRequests} />
          <StatCard label="Delivered Projects" value={data.projectStats?.deliveredCount} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-black dark:border-white rounded-lg p-4 text-center">
      <p className="text-2xl font-semibold text-black dark:text-white">{value}</p>
      <p className="text-xs text-black dark:text-white mt-1">{label}</p>
    </div>
  );
}

export default Dashboard;