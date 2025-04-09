import React from 'react'
import { teams } from '../assets/assets';

const LeagueTable = () => {
    const formColors = {
        W: 'bg-green-500',
        D: 'bg-gray-400',
        L: 'bg-red-500',
    }
    return (
    <div className='overflow-x-auto p-4'>
        <table className='min-w-full bg-white shadow rounded-lg'>
            <thead className='text-sm'>
                <tr>
                    <th className="p-2 text-left">Position</th>
                    <th className="p-2 text-left">Club</th>
                    <th className="p-2 text-center">Played</th>
                    <th className="p-2 text-center">Won</th>
                    <th className="p-2 text-center">Drawn</th>
                    <th className="p-2 text-center">Lost</th>
                    <th className="p-2 text-center">GF</th>
                    <th className="p-2 text-center">GA</th>
                    <th className="p-2 text-center">GD</th>
                    <th className="p-2 text-center">Points</th>
                    <th className="p-2 text-center">Form</th>
                    <th className="p-2 text-left">Next</th>
                </tr>
            </thead>
            <tbody>
                {teams.map((team) => (
                    <tr key={team.position} className='border-b'>
                        <td className="p-2">{team.position}</td>
                        <td className="p-2 font-medium flex items-center ">
                            <img src={team.logo} alt="logo" className='w-8 h-8 object-contain aspect-square'/>
                            <p>{team.club}</p>
                        </td>
                        <td className="p-2 text-center">{team.played}</td>
                        <td className="p-2 text-center">{team.won}</td>
                        <td className="p-2 text-center">{team.drawn}</td>
                        <td className="p-2 text-center">{team.lost}</td>
                        <td className="p-2 text-center">{team.gf}</td>
                        <td className="p-2 text-center">{team.ga}</td>
                        <td className="p-2 text-center">{team.gd}</td>
                        <td className="p-2 text-center font-bold">{team.points}</td>
                        <td className="p-2 text-center">
                            <div className="flex justify-center gap-1">
                            {team.form.map((result, i) => (
                                <span
                                key={i}
                                className={`w-5 h-5 rounded-full ${formColors[result]} text-white text-xs flex items-center justify-center`}
                                >
                                {result}
                                </span>
                            ))}
                            </div>
                        </td>
                        <td className="p-2 flex items-center">
                            <img src={teams.find((t) => t.club === team.next)?.logo} alt="logo" className='w-8 h-8 object-contain aspect-square'/>
                            {team.next}
                        </td>
                    </tr>
                ))

                }
            </tbody>
        </table>
    </div>
  )
}

export default LeagueTable