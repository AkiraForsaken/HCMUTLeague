import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';

/**
 * MatchPage component fetches and displays details of a specific match.
 * @returns {JSX.Element} The match detail UI with competitors and committee members
 */
const MatchPage = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/matches/${matchId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch match: ${response.status}`);
        }
        const data = await response.json();
        setMatch(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin" />
          <span className="text-2xl font-semibold text-indigo-700">Loading Match...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <Link
            to="/matches"
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium"
          >
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  // Filter competitors by team
  const homeCompetitors = match.competitors ? match.competitors.filter(c => c.team_name === match.home_team_name) : [];
  const awayCompetitors = match.competitors ? match.competitors.filter(c => c.team_name === match.away_team_name) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <div className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl animate-fade-in overflow-hidden">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-8 text-center">
          Match Details
        </h1>
        <div className="flex flex-col gap-8">
          {/* Teams and Score/Time */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between w-full gap-6">
            {/* Home Team */}
            <div className="flex flex-col items-center max-w-xs w-full animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Link to={`/teams/${encodeURIComponent(match.home_team_name)}`} className="relative group">
                <img
                  src={match.home_team_logo}
                  alt={match.home_team_name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-full bg-white/50 p-3 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                  onError={(e) => (e.target.src = '/logos/placeholder.png')}
                />
              </Link>
              <span className="mt-4 text-2xl sm:text-3xl font-bold uppercase text-indigo-800 group-hover:scale-105 transition-transform duration-300 text-center break-words">
                {match.home_team_name}
              </span>
            </div>

            {/* Score or Time */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in sm:static sm:translate-x-0 sm:translate-y-0" style={{ animationDelay: '200ms' }}>
              <div
                className={`inline-flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-md ${
                  match.is_finished ? 'text-2xl font-bold' : 'text-xl font-semibold'
                } text-indigo-900`}
              >
                {match.is_finished ? (
                  <div className="flex items-center gap-3">
                    <span>{match.score?.split('-')[0]?.trim() || '0'}</span>
                    <span className="text-indigo-600">-</span>
                    <span>{match.score?.split('-')[1]?.trim() || '0'}</span>
                  </div>
                ) : (
                  <span>{match.match_time}</span>
                )}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center max-w-xs w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Link to={`/teams/${encodeURIComponent(match.away_team_name)}`} className="relative group">
                <img
                  src={match.away_team_logo}
                  alt={match.away_team_name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-full bg-white/50 p-3 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
                  onError={(e) => (e.target.src = '/logos/placeholder.png')}
                />
              </Link>
              <span className="mt-4 text-2xl sm:text-3xl font-bold uppercase text-indigo-800 group-hover:scale-105 transition-transform duration-300 text-center break-words">
                {match.away_team_name}
              </span>
            </div>
          </div>

          {/* Match Details */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-inner animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="space-y-4">
              {[
                {
                  label: 'Date',
                  value: format(new Date(match.match_date), 'EEEE, d MMMM yyyy'),
                  icon: (
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  label: 'Time',
                  value: match.match_time,
                  icon: (
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  label: 'Stadium',
                  value: match.stadium_name,
                  icon: (
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  label: 'Round',
                  value: match.match_round,
                  icon: (
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                },
                {
                  label: 'Status',
                  value: match.is_finished ? 'Finished' : 'Upcoming',
                  icon: (
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                },
                ...(match.is_finished
                  ? []
                  : [
                      {
                        label: 'Tickets',
                        value: (
                          <Link
                            to={`/matches/${matchId}/booking`}
                            className="inline-flex px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-md"
                          >
                            Book a Ticket
                          </Link>
                        ),
                        icon: (
                          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        ),
                      },
                    ]),
              ].map(({ label, value, icon }, index) => (
                <div key={label} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${(500 + index * 100)}ms` }}>
                  {icon}
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-lg font-medium text-indigo-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Participants Section */}
          {match.is_finished && (
            <div className="mt-8 space-y-8">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-inner">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">Home Team Competitors ({match.home_team_name})</h3>
                <ul className="space-y-2">
                  {homeCompetitors.map((competitor) => (
                    <li key={competitor.com_id}>
                      <Link
                        to={`/teams/${encodeURIComponent(competitor.team_name)}/members/${encodeURIComponent(competitor.com_id)}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {competitor.first_name} {competitor.last_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-inner">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">Away Team Competitors ({match.away_team_name})</h3>
                <ul className="space-y-2">
                  {awayCompetitors.map((competitor) => (
                    <li key={competitor.com_id}>
                      <Link
                        to={`/teams/${encodeURIComponent(competitor.team_name)}/members/${encodeURIComponent(competitor.com_id)}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {competitor.first_name} {competitor.last_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-inner">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">Committee Members</h3>
                <ul className="space-y-2">
                  {match.committeeMembers.map((member) => (
                    <li key={member.com_mem_id}>
                      <Link
                        to={`/committee-members/${encodeURIComponent(member.com_mem_id)}`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {member.first_name} {member.last_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '900ms' }}>
            <Link
              to="/matches"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-md"
            >
              Back to Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;