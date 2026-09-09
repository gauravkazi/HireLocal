import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6">
      <div className="text-center mb-6 max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
          HireLocal
        </h1>
        <p className="text-sm text-black dark:text-white">
          Connecting businesses with trusted local talent — web developers,
          designers, writers, and marketers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-black dark:border-white rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Log in</h2>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <label className="text-sm text-black dark:text-white block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
          required
        />

        <label className="text-sm text-black dark:text-white block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-9 border border-black dark:border-white rounded px-2 mb-4 text-black dark:text-white dark:bg-black"
          required
        />

        <button
          type="submit"
          className="w-full h-9 bg-black dark:bg-white text-white dark:text-black rounded text-sm"
        >
          Log in
        </button>

        <p className="text-xs text-black dark:text-white mt-3 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;