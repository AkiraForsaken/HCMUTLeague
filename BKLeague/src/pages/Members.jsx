import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MemberDetails = () => {
  const { team_name, com_id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/teams/${encodeURIComponent(team_name)}/members/${encodeURIComponent(com_id)}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to load member details.');
        }
        setMember(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [team_name, com_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-300 rounded-full"></div>
          <span className="text-2xl font-bold text-indigo-800">Loading Member Details...</span>
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
            onClick={() => navigate(`/teams/${encodeURIComponent(team_name)}`)}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
          >
            Back to Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center">
            {member.full_name}
          </h1>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-inner">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Member Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ['Full Name', member.full_name, (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )],
                ['Role', member.role, (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )],
                ...(member.role === 'Player' ? [
                  ['League ID', member.league_id || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )],
                  ['Squad Number', member.squad_number || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8a5 5 0 0110 0M6 15a6 6 0 0112 0H6z" />
                    </svg>
                  )],
                  ['Position', member.position || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )],
                  ['Age', member.age || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )],
                  ['Weight', member.weight ? `${member.weight} kg` : 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-4m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-4m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  )],
                  ['Height', member.height ? `${member.height} cm` : 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20h16M4 4h16m-7 0v16m-6-16v16" />
                    </svg>
                  )],
                  ['Total Minutes Played', member.total_min_play || '0', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )],
                  ['Total Goals', member.total_goal || '0', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m-9-9v18" />
                    </svg>
                  )],
                  ['Total Assists', member.total_assist || '0', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )],
                ] : []),
                ...(member.role === 'Coach' ? [
                  ['Coach Title', member.coach_title || 'N/A', (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-6l-3 3m0 0l-3-3m3 3v12" />
                    </svg>
                  )],
                ] : []),
                ['Team', team_name, (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex items-center space-x-4">
                  {icon}
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-lg font-medium text-indigo-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate(`/teams/${encodeURIComponent(team_name)}`)}
              className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium shadow-md"
            >
              Back to Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;