import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
        HireLocal
      </h1>
      <p className="text-sm text-black dark:text-white max-w-md mb-6">
        Connecting businesses with trusted local talent — web developers,
        designers, writers, and marketers. Browse services, hire the right
        person, and track your project from start to delivery.
      </p>

      {user ? (
        <Link
          to="/services"
          className="h-9 px-5 flex items-center bg-black dark:bg-white text-white dark:text-black rounded text-sm"
        >
          Browse Services
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/login"
            className="h-9 px-5 flex items-center border border-black dark:border-white text-black dark:text-white rounded text-sm"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="h-9 px-5 flex items-center bg-black dark:bg-white text-white dark:text-black rounded text-sm"
          >
            Get started
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;