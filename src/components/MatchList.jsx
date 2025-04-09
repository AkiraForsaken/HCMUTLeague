import React from 'react'
import {matches} from '../assets/assets'

const MatchList = () => {
  return (
    <div className="w-full max-w-[1360px] mx-auto p-4 space-y-4">
      {matches.map((match, i) => (
        <div
        key={i}
        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            {/* Teams and Time Section */}
            <div className="grid grid-cols-3 items-center w-[25rem]">
                {/* Home Team */}
                <div className="flex items-center justify-start gap-2 font-semibold text-gray-800">
                    <img src={match.homeLogo} alt="" className="w-6 h-6" />
                    {match.homeTeam}
                </div>
                
                {/* Kickoff Time */}
                <div className="text-center text-gray-500 text-sm font-medium">
                    {match.time}
                </div>
            
                {/* Away Team */}
                <div className="flex items-center justify-end gap-2 font-semibold text-gray-800">
                    {match.awayTeam}
                    <img src={match.awayLogo} alt="" className="w-6 h-6" />
                </div>
            </div>
        
            {/* Stadium */}
            <div className="text-sm text-gray-600 flex items-center gap-1 flex-1 px-4 ml-50">
                {match.stadium}
            </div>
        
            {/* Quick View Button */}
            <button className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold px-4 py-1 rounded-full transition text-sm">
                Quick View
            <span className="ml-1"><i className="fa-solid fa-arrow-right"></i></span>
            </button>
        </div>
      ))}
    </div>
  )
}

export default MatchList