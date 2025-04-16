import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext.jsx';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-xl sticky top-0 z-50">
      {/* Logo and Title */}
      <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center space-x-3">
        <img
          src={assets.bklogo}
          alt="BK League Logo"
          className="h-12 transition-transform duration-300 hover:scale-110"
        />
        <p className="text-3xl font-extrabold tracking-tight">HCMUT Premier League</p>
      </NavLink>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center space-x-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          Matches
        </NavLink>
        <NavLink
          to="/teams"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          Teams
        </NavLink>
        <NavLink
          to="/stadiums"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          Stadiums
        </NavLink>
        <NavLink
          to="/booking"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          Booking
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          News
        </NavLink>
        <NavLink
          to="/pots"
          className={({ isActive }) =>
            `text-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'text-amber-300 font-extrabold bg-indigo-800/50 px-3 py-1 rounded-full shadow-md'
                : 'hover:text-amber-200'
            }`
          }
        >
          POTS
        </NavLink>

        {!user ? (
          <NavLink to="/signin">
            <button
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              onClick={() => setShowUserLogin(true)}
            >
              Login
            </button>
          </NavLink>
        ) : (
          <div className="relative">
            {/* User Icon and Username */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none"
            >
              <svg
                className="w-8 h-8 text-white hover:text-amber-300 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              <span className="text-sm font-medium truncate max-w-[100px]">{user.username}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute top-10 right-0 bg-white shadow-xl rounded-lg border border-gray-100 w-52 py-2 text-gray-800 text-sm z-50">
                <li
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors duration-200"
                >
                  Profile
                </li>
                <li
                  onClick={() => {
                    navigate('/change-name');
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors duration-200"
                >
                  Change Name
                </li>
                <li
                  onClick={() => {
                    navigate('/change-password');
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors duration-200"
                >
                  Change Password
                </li>
                <li
                  onClick={() => {
                    navigate('/booking');
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors duration-200"
                >
                  My Tickets
                </li>
                <li
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
        className="sm:hidden text-white focus:outline-none"
      >
        <img src={assets.menu_icon} alt="menu" className="w-8 h-8" />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-xl py-6 flex flex-col items-start gap-4 px-6 text-gray-800 sm:hidden">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/matches"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            Matches
          </NavLink>
          <NavLink
            to="/teams"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            Teams
          </NavLink>
          <NavLink
            to="/stadiums"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            Stadiums
          </NavLink>
          <NavLink
            to="/booking"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            Booking
          </NavLink>
          <NavLink
            to="/posts"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            News
          </NavLink>
          <NavLink
            to="/pots"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive
                  ? 'text-amber-600 font-extrabold bg-amber-100 px-3 py-1 rounded-full'
                  : 'hover:text-amber-600'
              } transition-colors duration-200`
            }
          >
            POTS
          </NavLink>

          {!user ? (
            <button
              className="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/profile');
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-2 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate('/change-name');
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-2 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
              >
                Change Name
              </button>
              <button
                onClick={() => {
                  navigate('/change-password');
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-2 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  navigate('/booking');
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-2 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
              >
                My Tickets
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;