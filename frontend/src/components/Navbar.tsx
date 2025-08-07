import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, role, setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Navbar: Current role:', role);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-4 text-center relative">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
          {/* پرچم ایران - سمت راست متن */}
          <img
            src="/images/iran-flag.gif"
            alt="Iran Flag"
            className="w-12 h-8 sm:w-16 sm:h-10 animate-wave"
          />
          {/* متن اصلی */}
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 animate-pulse drop-shadow-lg">
            سامانه مدیریت مسافرین          </h1>
          {/* پرچم ایران - سمت چپ متن */}
          <img
            src="/images/iran-flag.gif"
            alt="Iran Flag"
            className="w-12 h-8 sm:w-16 sm:h-10 animate-wave"
          />
        </div>
      </div>
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">سامانه مدیریت مسافرین</div>
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
                className={`${isOpen ? 'block' : 'hidden'
                  } sm:flex sm:items-center w-full sm:w-auto absolute sm:static top-16 left-0 right-0 bg-blue-800 sm:bg-transparent p-4 sm:p-0 z-10`}
              >
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-x-reverse">
                  {(role === 'level1' || role === 'level2' || role === 'admin') && (
                    <Link
                      to="/passengers"
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/passengers')
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-2 border-yellow-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-yellow-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-yellow-200'
                        } mb-2 sm:mb-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      جستجوی مسافر
                    </Link>
                  )}

                  {(role === 'level1' || role === 'admin') && (
                    <>
                      <Link
                        to="/passengers/create/normal"
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/passengers/create/normal')
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white border-2 border-green-300'
                          : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-green-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-green-200'
                          } mb-2 sm:mb-0`}
                        onClick={() => setIsOpen(false)}
                      >
                        ثبت مسافر عادی
                      </Link>
                      <Link
                        to="/passengers/create/vip"
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/passengers/create/vip')
                          ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white border-2 border-purple-300'
                          : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-purple-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-purple-200'
                          } mb-2 sm:mb-0`}
                        onClick={() => setIsOpen(false)}
                      >
                        ثبت مسافر VIP
                      </Link>
                    </>
                  )}

                  {(role === 'level2' || role === 'admin') && (
                    <Link
                      to="/packs"
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/packs')
                        ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white border-2 border-pink-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-pink-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-pink-200'
                        } mb-2 sm:mb-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      پک‌های مسافرتی
                    </Link>
                  )}

                  {(role === 'level2' || role === 'admin') && (
                    <Link
                      to="/bus-assignment"
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/bus-assignment')
                        ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white border-2 border-orange-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-orange-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-orange-200'
                        } mb-2 sm:mb-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      تخصیص اتوبوس
                    </Link>
                  )}

                  {role === 'admin' && (
                    <Link
                      to="/final-confirmation"
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/final-confirmation')
                        ? 'bg-gradient-to-r from-teal-400 to-teal-600 text-white border-2 border-teal-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-teal-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-teal-200'
                        } mb-2 sm:mb-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      ثبت نهایی
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link
                      to="/admin-report"
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/admin-report')
                        ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white border-2 border-purple-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-purple-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-purple-200'
                        } mb-2 sm:mb-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      گزارشات
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-800 border-2 border-red-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-700 hover:border-red-200 transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 mb-2 sm:mb-0"
                  >
                    خروج
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center shadow-md transform hover:scale-105 ${isActive('/login')
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white border-2 border-green-300'
                : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-green-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:border-green-200'
                }`}
            >
              ورود
            </Link>
          )}
        </div>
      </nav>

      {/* استایل‌های انیمیشن */}
      <style>{`
        .animate-wave {
          animation: wave 4s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 4s infinite ease-in-out;
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Navbar;