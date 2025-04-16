import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (result.success) {
          setUser(result.data);
        } else {
          setError(result.error || 'Failed to load profile. Please try logging in again.');
        }
      } catch (err) {
        setError('Unable to connect to the server. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-3xl font-bold text-indigo-600 animate-pulse flex items-center gap-2">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md">
          <p className="text-xl font-semibold text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/signin');
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10"></div>
          <h2 className="relative text-4xl font-bold capitalize tracking-tight">{user.role} Profile</h2>
          <p className="mt-3 text-lg opacity-90 font-medium">Welcome, {user.username}!</p>
        </div>

        {/* Core Information */}
        <div className="p-8 space-y-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Username</span>
                  <span className="text-base font-semibold">{user.username}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Email</span>
                  <span className="text-base font-semibold">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Role</span>
                  <span className="text-base font-semibold capitalize">{user.role}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Joined</span>
                  <span className="text-base font-semibold">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Details */}
          {user.role === 'Player' && user.player_info && (
            <div className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-indigo-100/80">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Player Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="text-base font-semibold">{`${user.player_info.com_first_name} ${user.player_info.com_last_name}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Age</span>
                  <span className="text-base font-semibold">{user.player_info.age || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Position</span>
                  <span className="text-base font-semibold">{user.player_info.position_player || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Squad Number</span>
                  <span className="text-base font-semibold">{user.player_info.squad_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Height</span>
                  <span className="text-base font-semibold">{user.player_info.height ? `${user.player_info.height} cm` : 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Weight</span>
                  <span className="text-base font-semibold">{user.player_info.weight ? `${user.player_info.weight} kg` : 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font sunspecify-medium text-gray-500">Team</span>
                  <span className="text-base font-semibold">{user.player_info.team_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Address</span>
                  <span className="text-base font-semibold">{user.player_info.com_street || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Postal Code</span>
                  <span className="text-base font-semibold">{user.player_info.postal_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'Coach' && user.coach_info && (
            <div className="bg-green-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-green-100/80">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Coach Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="text-base font-semibold">{`${user.coach_info.com_first_name} ${user.coach_info.com_last_name}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Age</span>
                  <span className="text-base font-semibold">{user.coach_info.age || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Title</span>
                  <span className="text-base font-semibold">{user.coach_info.coach_title || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Team</span>
                  <span className="text-base font-semibold">{user.coach_info.team_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Address</span>
                  <span className="text-base font-semibold">{user.coach_info.com_street || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Postal Code</span>
                  <span className="text-base font-semibold">{user.coach_info.postal_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'Personal Doctor' && user.doctor_info && (
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-blue-100/80">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Personal Doctor Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="text-base font-semibold">{`${user.doctor_info.com_first_name} ${user.doctor_info.com_last_name}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Age</span>
                  <span className="text-base font-semibold">{user.doctor_info.age || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Title</span>
                  <span className="text-base font-semibold">{user.doctor_info.doctor_title || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Team</span>
                  <span className="text-base font-semibold">{user.doctor_info.team_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Supported Player</span>
                  <span className="text-base font-semibold">{`${user.doctor_info.player_first_name || ''} ${user.doctor_info.player_last_name || 'N/A'}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Address</span>
                  <span className="text-base font-semibold">{user.doctor_info.com_street || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Postal Code</span>
                  <span className="text-base font-semibold">{user.doctor_info.postal_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'Club Doctor' && user.club_doctor_info && (
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-blue-100/80">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Club Doctor Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="text-base font-semibold">{`${user.club_doctor_info.com_first_name} ${user.club_doctor_info.com_last_name}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Age</span>
                  <span className="text-base font-semibold">{user.club_doctor_info.age || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Title</span>
                  <span className="text-base font-semibold">{user.club_doctor_info.doctor_title || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Team</span>
                  <span className="text-base font-semibold">{user.club_doctor_info.team_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Address</span>
                  <span className="text-base font-semibold">{user.club_doctor_info.com_street || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Postal Code</span>
                  <span className="text-base font-semibold">{user.club_doctor_info.postal_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {['Main Referee', 'Match Manager', 'Video Assistant Referee', 'Sponsor'].includes(user.role) &&
            user.committee_info && (
              <div className="bg-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-yellow-100/80">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Committee Member Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Name</span>
                    <span className="text-base font-semibold">{`${user.committee_info.first_name} ${user.committee_info.last_name}`}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Nationality</span>
                    <span className="text-base font-semibold">{user.committee_info.nationality || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

          {user.role === 'Spectator' && user.committee_info && (
            <div className="bg-teal-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-teal-100/80">
              <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Spectator Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="text-base font-semibold">{`${user.committee_info.first_name} ${user.committee_info.last_name}`}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Nationality</span>
                  <span className="text-base font-semibold">{user.committee_info.nationality || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-200 hover:bg-red-100/80">
              <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 2.896 2 4zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m2 2v7m4-9c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 2.896 2 4zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2m2 2v7" />
                </svg>
                Admin Privileges
              </h3>
              <p className="text-base text-gray-700">Full access to manage the league.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100/80 backdrop-blur-sm p-6 text-center space-x-4">
          {['Player', 'Coach', 'Main Referee', 'Match Manager', 'Video Assistant Referee', 'Sponsor'].includes(user.role) && (
            <button
              onClick={() => navigate('/nextmatch')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming Match
            </button>
          )}

          {user.role === 'Spectator' && (
            <>
              <button
                onClick={() => navigate('/booking')}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Book a Ticket
              </button>
              <button
                onClick={() => navigate('/mytickets')}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Your Tickets
              </button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/addpost')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.414 9 12.586 15.586 6z" />
                </svg>
                Make a Post
              </button>
              <button
                onClick={() => navigate('/addstadium')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
                </svg>
                Add Stadium
              </button>
              <button
                onClick={() => navigate('/deletematch')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel a Match
              </button>
              <button
                onClick={() => navigate('/donematch')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Done a Match
              </button>
            </>
          )}

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;