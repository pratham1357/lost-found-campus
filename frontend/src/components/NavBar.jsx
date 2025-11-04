import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Lost & Found
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/report-lost" className="text-gray-700 hover:text-blue-600">
                  Report Lost
                </Link>
                <Link to="/report-found" className="text-gray-700 hover:text-blue-600">
                  Report Found
                </Link>
                <Link to="/my-submissions" className="text-gray-700 hover:text-blue-600">
                  My Items
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;