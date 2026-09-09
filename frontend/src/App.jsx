import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseServices from './pages/BrowseServices';
import ServiceDetail from './pages/ServiceDetail';
import MyRequests from './pages/MyRequests';
import MyServices from './pages/MyServices';
import ReceivedRequests from './pages/ReceivedRequests';
import Dashboard from './pages/Dashboard';
import ProviderProfile from './pages/ProviderProfile';
import ActivityLogs from './pages/ActivityLogs';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<BrowseServices />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/received-requests" element={<ReceivedRequests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProviderProfile />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;