import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, role, setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">مدیریت سفر</div>
        {token ? (
          <>
            <button
              className="sm:hidden text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
            <div
              className={`${
                isOpen ? 'block' : 'hidden'
              } sm:flex sm:items-center w-full sm:w-auto absolute sm:static top-16 left-0 right-0 bg-blue-600 sm:bg-transparent p-4 sm:p-0 z-10`}
            >
              <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-x-reverse">
                <Link
                  to="/packs"
                  className="text-white hover:text-blue-200 mb-2 sm:mb-0"
                  onClick={() => setIsOpen(false)}
                >
                  پک‌های مسافرتی
                </Link>
                <Link
                  to="/passengers"
                  className="text-white hover:text-blue-200 mb-2 sm:mb-0"
                  onClick={() => setIsOpen(false)}
                >
                  مسافران
                </Link>
                <Link
                  to="/buses"
                  className="text-white hover:text-blue-200 mb-2 sm:mb-0"
                  onClick={() => setIsOpen(false)}
                >
                  اتوبوس‌ها
                </Link>
                {role === 'level1' && (
                  <>
                    <Link
                      to="/passengers/create/normal"
                      className="text-white hover:text-blue-200 mb-2 sm:mb-0"
                      onClick={() => setIsOpen(false)}
                    >
                      ثبت مسافر عادی
                    </Link>
                    <Link
                      to="/passengers/create/vip"
                      className="text-white hover:text-blue-200 mb-2 sm:mb-0"
                      onClick={() => setIsOpen(false)}
                    >
                      ثبت مسافر VIP
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-white hover:text-blue-200 text-right"
                >
                  خروج
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="text-white hover:text-blue-200">
            ورود
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;