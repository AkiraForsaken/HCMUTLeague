import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to turn "team_logo_url" into "Team Logo URL"
function prettifyFieldName(field) {
  return field
    .split('_')
    .map((segment) => {
      if (['url', 'id', 'api', 'ip'].includes(segment.toLowerCase())) {
        return segment.toUpperCase();
      }
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(' ');
}

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Mapping of roles to their required fields
  const roleFields = {
    admin: ['username', 'password', 'email', 'key'],
    team: ['name', 'city', 'country', 'trophy', 'team_logo_url', 'key'],
    player: [
      'username', 'password', 'email', 'first_name', 'last_name', 'age',
      'com_street', 'postal_code', 'squad_number', 'position_player',
      'weight', 'height', 'team_name',
    ],
    coach: [
      'username', 'password', 'email', 'first_name', 'last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'coach_title',
    ],
    personal_doctor: [
      'username', 'password', 'email', 'first_name', 'last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'doctor_title',
      'supported_player_id',
    ],
    club_doctor: [
      'username', 'password', 'email', 'first_name', 'last_name', 'age',
      'com_street', 'postal_code', 'team_name', 'doctor_title',
    ],
    main_referee: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
    match_manager: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
    video_assistant_referee: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
    sponsor: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
    spectator: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
  };

  // Mapping of roles to their API endpoints
  const roleEndpoints = {
    admin: '/register/admin',
    team: '/register/team',
    player: '/register/team_member/player',
    coach: '/register/team_member/coach',
    personal_doctor: '/register/team_member/personal_doctor',
    club_doctor: '/register/team_member/club_doctor',
    main_referee: '/register/committee_member/main_referee',
    match_manager: '/register/committee_member/match_manager',
    video_assistant_referee: '/register/committee_member/video_assistant_referee',
    sponsor: '/register/committee_member/sponsor',
    spectator: '/register/spectator',
  };

  // Input types for specific fields
  const fieldTypes = {
    password: 'password',
    key: 'password',
    email: 'email',
    age: 'number',
    weight: 'number',
    height: 'number',
    squad_number: 'number',
  };

  // List of roles for button display
  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'spectator', label: 'Spectator' }, // Added Spectator
    { id: 'team', label: 'Team' },
    { id: 'player', label: 'Player' },
    { id: 'coach', label: 'Coach' },
    { id: 'personal_doctor', label: 'Personal Doctor' },
    { id: 'club_doctor', label: 'Club Doctor' },
    { id: 'main_referee', label: 'Main Referee' },
    { id: 'match_manager', label: 'Match Manager' },
    { id: 'video_assistant_referee', label: 'Video Assistant Referee' },
    { id: 'sponsor', label: 'Sponsor' },
  ];

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const initialFormData = roleFields[role].reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
  };

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    const apiURL = `http://localhost:5000/api/auth${roleEndpoints[selectedRole]}`;
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert('Registration successful! You can now log in.');
        navigate('/signin');
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <h2 className="text-4xl font-playfair font-bold text-gray-900 text-center drop-shadow-md">
          Register Your Account/Team
        </h2>

        {!selectedRole ? (
          <div className="p-6 bg-white rounded-xl shadow-lg">
            {/* Admin and Spectator Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <button
                onClick={() => handleRoleSelect('admin')}
                className="bg-pink-500 hover:bg-pink-600 text-white font-inter font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              >
                Register as Admin
              </button>
              <button
                onClick={() => handleRoleSelect('spectator')}
                className="bg-teal-500 hover:bg-teal-600 text-white font-inter font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
              >
                Register as Spectator
              </button>
            </div>
            {/* Other Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {roles
                .filter((role) => role.id !== 'admin' && role.id !== 'spectator')
                .map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Register as {role.label}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <button
              onClick={() => setSelectedRole('')}
              className="mb-6 text-indigo-600 font-inter font-medium hover:text-indigo-800 hover:underline transition-colors duration-200"
            >
              ← Back to Role Selection
            </button>
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-playfair font-semibold text-gray-800 text-center">
                Register as {roles.find((r) => r.id === selectedRole)?.label}
              </h3>
              <div className="space-y-4">
                {roleFields[selectedRole].map((field) => (
                  <div key={field} className="w-full">
                    <label
                      htmlFor={field}
                      className="block text-sm font-inter font-medium text-gray-700"
                    >
                      {prettifyFieldName(field)}
                    </label>
                    <input
                      id={field}
                      type={fieldTypes[field] || 'text'}
                      value={formData[field] || ''}
                      onChange={handleInputChange(field)}
                      placeholder={`Enter ${prettifyFieldName(field)}`}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 font-inter"
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-inter font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-gray-600 font-inter">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline cursor-pointer transition-colors duration-200"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;