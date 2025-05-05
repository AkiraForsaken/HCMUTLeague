import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Match component renders a single match with a compact, professional design, showing score for finished matches.
 * @param {Object} props - Component props
 * @param {Object} props.match - Match data from API
 * @returns {JSX.Element} The match UI
 */
const Match = ({ match }) => {
  console.log('Match prop:', match); // Debug log to inspect match_id

  // Return null or a fallback UI if match is undefined or missing required properties
  if (!match || !match.match_id || !match.home_team_logo || !match.away_team_logo) {
    return (
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl w-full max-w-[35rem] mx-auto text-center">
        <p className="text-red-600 font-semibold">Invalid match data</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl hover:shadow-3xl hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border-2 border-gradient-to-r from-indigo-300/50 to-purple-300/50 hover:border-indigo-500/70 flex flex-col items-center w-full max-w-[35rem] mx-auto">
      {/* Teams Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center justify-center max-w-xs w-full">
          <img
            src={match.home_team_logo}
            alt={match.home_team_name || 'Home Team'}
            className="w-12 h-12 object-contain mb-2"
            onError={(e) => (e.target.src = '/logos/placeholder.png')} // Fallback logo
          />
          <span className="text-xl font-semibold text-indigo-900 tracking-tight text-center">
            {match.home_team_name || 'Unknown Team'}
          </span>
        </div>

        {/* Kickoff Time or Score */}
        <div className="text-center">
          <div
            className={`inline-block bg-indigo-100/30 text-indigo-900 rounded-full shadow-inner ${
              match.is_finished ? 'text-xl font-bold px-8 py-3' : 'text-base font-semibold px-6 py-2'
            }`}
          >
            {match.is_finished ? (
              <div className="flex items-center justify-center gap-2">
                <span>{match.score?.split('-')[0]?.trim() || '0'}</span>
                <span>-</span>
                <span>{match.score?.split('-')[1]?.trim() || '0'}</span>
              </div>
            ) : (
              match.match_time || 'TBD'
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center justify-center max-w-xs w-full">
          <img
            src={match.away_team_logo}
            alt={match.away_team_name || 'Away Team'}
            className="w-12 h-12 object-contain mb-2"
            onError={(e) => (e.target.src = '/logos/placeholder.png')} // Fallback logo
          />
          <span className="text-xl font-semibold text-indigo-900 tracking-tight text-center">
            {match.away_team_name || 'Unknown Team'}
          </span>
        </div>
      </div>

      {/* Stadium and Status Section */}
      <div className="flex flex-col items-center gap-3 mt-3 w-full border-b border-indigo-300/50 pb-3">
        <div className="text-lg text-indigo-800 italic font-semibold flex items-center gap-3">
          <svg
            className="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {match.stadium_name || 'Unknown Stadium'}
        </div>
        <span className={`text-base font-semibold ${match.is_finished ? 'text-gray-500' : 'text-indigo-600'}`}>
          {match.is_finished ? 'Done' : 'Up Coming'}
        </span>
      </div>

      {/* Quick View Link */}
      <Link
        to={`/matches/${match.match_id}`}
        className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-semibold px-8 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-inner inline-flex items-center"
      >
        Quick View
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default Match;