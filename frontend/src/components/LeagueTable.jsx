import React, { useState, useEffect } from 'react';

const LeagueTable = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formColors = {
    W: 'bg-green-500',
    D: 'bg-gray-400',
    L: 'bg-red-500',
    'N/A': 'bg-purple-200',
  };

  useEffect(() => {
    const fetchLeagueTable = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups', {
          credentials: 'include', // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch league table: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeagueTable();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin" />
          <span className="text-3xl font-semibold text-purple-700">Loading League Table...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center min-h-screen">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-2xl font-semibold text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium shadow-md text-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-5xl font-bold text-purple-900 mb-10 text-center tracking-tight drop-shadow-md">
          HCMUT Premier League Table
        </h2>
        <div className="overflow-x-auto rounded-2xl shadow-xl">
          <table className="w-full bg-white/90 backdrop-blur-sm border-2 border-purple-300 rounded-2xl">
            <thead className="bg-purple-700 text-white text-base">
              <tr>
                <th className="p-4 text-left font-bold rounded-tl-2xl">Pos</th>
                <th className="p-4 text-left font-bold">Club</th>
                <th className="p-4 text-center font-bold">PLD</th>
                <th className="p-4 text-center font-bold">W</th>
                <th className="p-4 text-center font-bold">D</th>
                <th className="p-4 text-center font-bold">L</th>
                <th className="p-4 text-center font-bold">GF</th>
                <th className="p-4 text-center font-bold">GA</th>
                <th className="p-4 text-center font-bold">GD</th>
                <th className="p-4 text-center font-bold">PTS</th>
                <th className="p-4 text-center font-bold">Last 5</th>
                <th className="p-4 text-left font-bold rounded-tr-2xl">Next</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr
                  key={team.position}
                  className={`border-b-2 border-purple-400 hover:bg-purple-50/50 transition-colors duration-300 ${
                    index < 6
                      ? 'bg-gradient-to-r from-purple-100 to-green-100/50'
                      : index >= teams.length - 3
                      ? 'bg-red-50/50'
                      : ''
                  }`}
                >
                  <td className="p-4 font-medium text-purple-800 text-lg">{team.position}</td>
                  <td className="p-4 font-bold text-purple-900 text-lg flex items-center gap-3">
                    <img
                      src={team.logo}
                      alt={`${team.club} logo`}
                      className="w-10 h-10 object-contain rounded-full border border-purple-200 shadow-sm hover:scale-105 transition-transform duration-200"
                      onError={(e) => (e.target.src = '/logos/placeholder.png')}
                    />
                    <span className="truncate">{team.club}</span>
                  </td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.played}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.won}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.drawn}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.lost}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.gf}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.ga}</td>
                  <td className="p-4 text-center font-medium text-purple-800 text-lg">{team.gd}</td>
                  <td className="p-4 text-center font-bold text-purple-700 text-lg">{team.points}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {team.form.map((result, i) => (
                        <span
                          key={i}
                          className={`w-7 h-7 rounded-full ${formColors[result]} ${
                            result === 'N/A' ? 'text-purple-600' : 'text-white'
                          } text-sm font-bold flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200`}
                          title={
                            result === 'N/A'
                              ? 'No match played'
                              : `Match ${i + 1}: ${result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}`
                          }
                        >
                          {result === 'N/A' ? '-' : result}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    {team.next ? (
                      <>
                        <img
                          src={team.next.logo}
                          alt={`${team.next.club} logo`}
                          className="w-10 h-10 object-contain rounded-full border border-purple-200 shadow-sm hover:scale-105 transition-transform duration-200"
                          onError={(e) => (e.target.src = '/logos/placeholder.png')}
                        />
                        <span className="font-medium text-purple-800 text-lg truncate">{team.next.club}</span>
                      </>
                    ) : (
                      <span className="font-medium text-purple-500 text-lg">TBD</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeagueTable;