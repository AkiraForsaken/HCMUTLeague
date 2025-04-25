import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Match from './Match';

/**
 * MatchList component fetches and displays the latest 5 finished and next 10 upcoming matches.
 * @returns {JSX.Element} The match list UI
 */
const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/matches', {
          credentials: 'include', // Include cookies for CORS
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.status}`);
        }
        const data = await response.json();
        console.log('Matches API Response:', data); // Debug log
        // Filter valid matches
        const validMatches = data.filter(
          (match) =>
            match &&
            match.match_id &&
            match.home_team_logo &&
            match.away_team_logo &&
            match.home_team_name &&
            match.away_team_name
        );
        // Filter and sort matches
        const finishedMatches = validMatches
          .filter((match) => match.is_finished)
          .sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
          .slice(0, 5);
        const upcomingMatches = validMatches
          .filter((match) => !match.is_finished)
          .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
          .slice(0, 10);
        setMatches([...finishedMatches, ...upcomingMatches]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Group matches by date
  const groupedMatches = matches.reduce((result, match) => {
    const date = match.match_date; // e.g., "2025-04-19"
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(match);
    return result;
  }, {});

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin" />
          <span className="text-2xl font-semibold text-indigo-700">Loading Matches...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Separate finished and upcoming matches
  const finishedMatches = matches.filter((match) => match.is_finished);
  const upcomingMatches = matches.filter((match) => !match.is_finished);

  // Render matches
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Our Matches Section */}
        {finishedMatches.length > 0 && (
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold text-indigo-800 mb-8">
              Previous Matches
            </h1>
            {Object.entries(groupedMatches)
              .filter(([date]) => finishedMatches.some((m) => m.match_date === date))
              .map(([date, matches], index) => (
                <div key={date} className="mb-12 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 mb-6">
                    {format(new Date(date), 'EEEE d MMMM yyyy')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map((match) => (
                      <Match key={match.match_id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Upcoming Matches Section */}
        {upcomingMatches.length > 0 && (
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold text-indigo-800 mb-8">
              Upcoming Matches
            </h1>
            {Object.entries(groupedMatches)
              .filter(([date]) => upcomingMatches.some((m) => m.match_date === date))
              .map(([date, matches], index) => (
                <div key={date} className="mb-12 animate-fade-in" style={{ animationDelay: `${(index + finishedMatches.length) * 100}ms` }}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 mb-6">
                    {format(new Date(date), 'EEEE d MMMM yyyy')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map((match) => (
                      <Match key={match.match_id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;