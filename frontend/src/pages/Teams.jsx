import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import MemberDetails from './Members';

const API_BASE_URL = 'http://localhost:5000';

// Function to generate a unique background color based on team_name
const getTeamLogoBgColor = (team_name) => {
  const colors = [
    'bg-blue-600',   // Deep Blue
    'bg-green-600',  // Forest Green
    'bg-red-600',    // Crimson Red
    'bg-yellow-600', // Amber
    'bg-teal-600',   // Teal
    'bg-orange-600', // Deep Orange
  ];
  // Simple hash to pick a color deterministically
  const hash = team_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const TeamList = ({ teams, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-300 rounded-full"></div>
          <span className="text-2xl font-bold text-indigo-800">Loading Our Teams...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-12">
        Our Teams
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
        {teams.map((team, index) => (
          <div
            key={team.team_id}
            onClick={() => navigate(`/teams/${encodeURIComponent(team.team_name)}`)}
            className="cursor-pointer bg-white/70 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center space-y-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {team.team_logo_url ? (
              <img
                src={team.team_logo_url}
                alt={`${team.team_name} logo`}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                No Logo
              </div>
            )}
            <h2 className="text-2xl font-bold text-indigo-900 text-center break-words w-full">
              {team.team_name}
            </h2>
            <p className="text-sm text-gray-700 text-center">
              {team.team_city}, {team.team_country}
            </p>
            <div className="mt-auto inline-flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition font-medium">
              <span>View Details</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamDetails = () => {
  const { team_name } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState({ players: [], coaches: [], doctors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch team details
        const teamRes = await fetch(`${API_BASE_URL}/api/teams/${encodeURIComponent(team_name)}`);
        if (!teamRes.ok) {
          throw new Error(`HTTP error! Status: ${teamRes.status}`);
        }
        const teamResult = await teamRes.json();
        if (!teamResult.success) {
          throw new Error(teamResult.error || 'Failed to load team details.');
        }

        // Fetch team members
        const membersRes = await fetch(`${API_BASE_URL}/api/teams/${encodeURIComponent(team_name)}/members`);
        if (!membersRes.ok) {
          throw new Error(`HTTP error! Status: ${membersRes.status}`);
        }
        const membersResult = await membersRes.json();
        if (!membersResult.success) {
          throw new Error(membersResult.error || 'Failed to load team members.');
        }

        setTeam(teamResult.data);
        setMembers(membersResult.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [team_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-300 rounded-full"></div>
          <span className="text-2xl font-bold text-indigo-800">Loading Team Details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/teams')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Information Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Header */}
          <div className={`relative ${getTeamLogoBgColor(team.team_name)} p-12 text-white text-center`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-stripes.png')] opacity-10"></div>
            {team.team_logo_url && (
              <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <img
                  src={team.team_logo_url}
                  alt={`${team.team_name} logo`}
                  className="w-28 h-28 object-contain"
                />
              </div>
            )}
            <h1 className="relative text-5xl font-extrabold tracking-tight">{team.team_name}</h1>
            <p className="mt-2 text-lg font-medium text-white/80">{team.team_another_name || 'No Alternative Name'}</p>
          </div>

          {/* Body */}
          <div className="p-10 space-y-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-inner">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Team Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  ['Team ID', team.team_id, (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10v10H7zM7 7V4a1 1 0 011-1h8a1 1 0 011 1v3" />
                    </svg>
                  )],
                  ['Alternative Name', team.team_another_name || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )],
                  ['City', team.team_city, (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  )],
                  ['Country', team.team_country, (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )],
                  ['Created At', team.team_created_at || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )],
                  ['Trophies', team.team_trophies ?? 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 7.143 15.429 10.571 17.714 17.429 12 14.857 6.286 17.429 8.571 10.571 3 7.143l5.714 2.714L11 3z" />
                    </svg>
                  )],
                  ['Owner', team.team_owner || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A7.992 7.992 0 0112 14a7.992 7.992 0 016.879 3.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )],
                  ['Group ID', team.group_id ?? 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )],
                ].map(([label, value, icon], index) => (
                  <div key={label} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${100 + index * 100}ms` }}>
                    {icon}
                    <div>
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="text-lg font-medium text-indigo-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/teams')}
                className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium shadow-md"
              >
                Back to Teams
              </button>
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 tracking-tight">Team Personnel</h2>
          <div className="space-y-8">
            {/* Coaches */}
            <div>
              <h3 className="relative text-xl font-semibold text-indigo-900 mb-4 pl-6 bg-gradient-to-r from-purple-100 to-white rounded-l-lg py-2">
                <span className="absolute left-0 top-0 bottom-0 w-2 bg-purple-600"></span>
                Coaches
              </h3>
              {members.coaches.length > 0 ? (
                <ul className="space-y-3">
                  {members.coaches.map((coach, index) => (
                    <li
                      key={index}
                      onClick={() => navigate(`/teams/${encodeURIComponent(team.team_name)}/members/${encodeURIComponent(coach.com_id)}`)}
                      className="cursor-pointer flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:bg-gray-100/50 transition animate-fade-in"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 12h-3.75a.75.75 0 01-.75-.75V9a3 3 0 00-6 0v2.25a.75.75 0 01-.75.75H4.5M12 12v9" />
                        </svg>
                        <span className="text-indigo-900 font-medium">{coach.full_name}</span>
                      </div>
                      <span className="text-purple-600 font-medium">{coach.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 pl-6">No coaches assigned</p>
              )}
            </div>
            {/* Players */}
            <div>
              <h3 className="relative text-xl font-semibold text-indigo-900 mb-4 pl-6 bg-gradient-to-r from-purple-100 to-white rounded-l-lg py-2">
                <span className="absolute left-0 top-0 bottom-0 w-2 bg-purple-600"></span>
                Players
              </h3>
              {members.players.length > 0 ? (
                <ul className="space-y-3">
                  {members.players.map((player, index) => (
                    <li
                      key={index}
                      onClick={() => navigate(`/teams/${encodeURIComponent(team.team_name)}/members/${encodeURIComponent(player.com_id)}`)}
                      className="cursor-pointer flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:bg-gray-100/50 transition animate-fade-in"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8a5 5 0 0110 0M6 15a6 6 0 0112 0H6z" />
                        </svg>
                        <span className="text-indigo-900 font-medium">{player.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600 font-medium">#{player.squad_number || 'N/A'}</span>
                        <span className="text-purple-600 font-medium">{player.position}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 pl-6">No players found for this team.</p>
              )}
            </div>
            {/* Club Doctors */}
            <div>
              <h3 className="relative text-xl font-semibold text-indigo-900 mb-4 pl-6 bg-gradient-to-r from-purple-100 to-white rounded-l-lg py-2">
                <span className="absolute left-0 top-0 bottom-0 w-2 bg-purple-600"></span>
                Club Doctors
              </h3>
              {members.doctors.length > 0 ? (
                <ul className="space-y-3">
                  {members.doctors.map((doctor, index) => (
                    <li
                      key={index}
                      onClick={() => navigate(`/teams/${encodeURIComponent(team.team_name)}/members/${encodeURIComponent(doctor.com_id)}`)}
                      className="cursor-pointer flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:bg-gray-100/50 transition animate-fade-in"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-indigo-900 font-medium">{doctor.full_name}</span>
                      </div>
                      <span className="text-purple-600 font-medium">{doctor.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 pl-6">No club doctors assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/teams`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        if (result.success) setTeams(result.data);
        else setError(result.error || 'Failed to load teams.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<TeamList teams={teams} loading={loading} error={error} />} />
      <Route path=":team_name" element={<TeamDetails />} />
      <Route path=":team_name/members/:com_id" element={<MemberDetails />} />
    </Routes>
  );
};

export default Teams;