import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { prettifyFieldName } from './Register';

const API_BASE_URL = 'http://localhost:5000';

const EditProfile = () => {
  const roleFields = {
    admin: ['username', 'password', 'email'],
    team: ['name', 'city', 'country', 'trophy', 'team_logo_url'],
    player: [
      'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
      'com_street', 'postal_code', 'squad_number', 'position_player',
      'weight', 'height', 'team_name',
    ],
    coach: [
      'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'coach_title',
    ],
    personal_doctor: [
      'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'doctor_title',
      'supported_player_id',
    ],
    club_doctor: [
      'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'doctor_title',
    ],
    main_referee: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
    match_manager: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
    video_assistant_referee: ['username', 'password', 'email', 'com_mem_first_name', 'last_name', 'nationality'],
    sponsor: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
    spectator: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
  };

  const fieldTypes = {
    password: 'password',
    email: 'email',
    age: 'number',
    weight: 'number',
    height: 'number',
    squad_number: 'number',
  };

  const [formData, setFormData] = useState({});
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        toast.error('Error getting token');
        navigate('/signin');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          const normalizedRole = result.data.role.toLowerCase().replace(/\s+/g, '_');
          if (roleFields[normalizedRole]) {
            setRole(normalizedRole);
            setFormData(result.data);
          } else {
            setError('Invalid role received from backend');
            toast.error('Invalid role received from backend');
          }
        } else {
          setError(result.error || 'Failed to load profile');
          toast.error(result.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('Unable to connect to the server. Please check your connection and try again.');
        toast.error('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/teams`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        if (result.success) {
          setTeams(result.data);
        } else {
          toast.error('Failed to fetch teams');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching teams');
      }
    };

    fetchTeams();
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => {
      let updatedData;

      if (['username', 'password', 'email'].includes(field)) {
        updatedData = { ...prev, [field]: e.target.value };
      } else if (['main_referee', 'match_manager', 'video_assistant_referee', 'sponsor', 'spectator'].includes(role)) {
        updatedData = {
          ...prev,
          committee_info: {
            ...prev.committee_info,
            [field]: e.target.value,
          },
        };
      } else if (['player', 'coach', 'personal_doctor', 'club_doctor'].includes(role)) {
        updatedData = {
          ...prev,
          [`${role}_info`]: {
            ...prev[`${role}_info`],
            [field]: e.target.value,
          },
        };
      } else {
        updatedData = { ...prev, [field]: e.target.value };
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Error getting token');
      return;
    }
    const updatedFormData = { ...formData };
    if (!updatedFormData.password) {
      delete updatedFormData.password;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Profile updated successfully');
        navigate('/profile');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error updating profile');
    }
  };

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
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white text-center rounded-t-3xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10"></div>
          <h2 className="relative text-3xl font-bold tracking-tight">Edit Your Profile</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {roleFields[role].map((field) => (
            <div key={field} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700">
                {prettifyFieldName(field)}
              </label>
              {field === 'team_name' ? (
                <select
                  value={
                    role === 'main_referee' || role === 'match_manager' || role === 'video_assistant_referee' || role === 'sponsor' || role === 'spectator'
                      ? formData.committee_info?.[field] || ''
                      : formData[`${role}_info`]?.[field] || formData[field] || ''
                  }
                  onChange={handleInputChange(field)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_name}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={fieldTypes[field] || 'text'}
                  value={
                    role === 'main_referee' || role === 'match_manager' || role === 'video_assistant_referee' || role === 'sponsor' || role === 'spectator'
                      ? formData.committee_info?.[field] || formData[field] || ''
                      : formData[`${role}_info`]?.[field] || formData[field] || ''
                  }
                  onChange={handleInputChange(field)}
                  placeholder={
                    field === 'email' ? 'Enter your email' :
                    field === 'username' ? 'Enter your username' :
                    field === 'password' ? 'Enter new password' :
                    'Enter ' + prettifyFieldName(field)
                  }
                  className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required={field !== 'password'}
                />
              )}
              {field === 'password' && (
                <p className="mt-1 text-sm text-gray-500">Leave blank to keep current password</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md text-lg font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;