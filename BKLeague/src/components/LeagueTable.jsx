import React from 'react';
import { teams } from '../assets/assets';

const LeagueTable = () => {
  const formColors = {
    W: 'bg-green-600',
    D: 'bg-gray-500',
    L: 'bg-red-600',
  };

  return (
    <div className="w-full p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">
          HCMUT Premier League Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-indigo-700 text-white text-sm">
              <tr>
                <th className="p-4 text-left font-extrabold">Pos</th>
                <th className="p-4 text-left font-extrabold">Club</th>
                <th className="p-4 text-center font-extrabold">PLD</th>
                <th className="p-4 text-center font-extrabold">W</th>
                <th className="p-4 text-center font-extrabold">D</th>
                <th className="p-4 text-center font-extrabold">L</th>
                <th className="p-4 text-center font-extrabold">GF</th>
                <th className="p-4 text-center font-extrabold">GA</th>
                <th className="p-4 text-center font-extrabold">GD</th>
                <th className="p-4 text-center font-extrabold">PTS</th>
                <th className="p-4 text-center font-extrabold">Last 5</th>
                <th className="p-4 text-left font-extrabold">Next</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr
                  key={team.position}
                  className={`border-b hover:bg-indigo-50 transition-colors duration-200 ${
                    index < 3 ? 'bg-green-50' : index >= teams.length - 3 ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="p-4 font-medium text-gray-700">{team.position}</td>
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-3">
                    <img
                      src={team.logo}
                      alt={`${team.club} logo`}
                      className="w-8 h-8 object-contain aspect-square rounded-full"
                    />
                    <span className="truncate">{team.club}</span>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.played}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.won}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.drawn}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.lost}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.gf}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.ga}</td>
                  <td className="p-4 text-center font-medium text-gray-700">{team.gd}</td>
                  <td className="p-4 text-center font-extrabold text-indigo-700">{team.points}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {team.form.map((result, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-full ${formColors[result]} text-white text-xs font-bold flex items-center justify-center shadow-sm`}
                          title={`Match ${i + 1}: ${result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={teams.find((t) => t.club === team.next)?.logo}
                      alt={`${team.next} logo`}
                      className="w-8 h-8 object-contain aspect-square rounded-full"
                    />
                    <span className="font-medium text-gray-700 truncate">{team.next}</span>
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