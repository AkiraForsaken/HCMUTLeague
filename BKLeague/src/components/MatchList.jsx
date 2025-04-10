import React from 'react'
import {matches, assets} from '../assets/assets'
import {format} from 'date-fns'

const MatchList = () => {
  const groupedMatches = matches.reduce((result, match) => { 
    if (!result[match.date]) {
      result[match.date] = [];
    }
    result[match.date].push(match);
    return result;
  }, {}); // the result is an object with dates as key and an array of matches in that date as the value
  return (
    <div className='w-full max-w-[1360px] mx-auto p-4 '>
    {Object.entries(groupedMatches).map(([date, matches]) => (
      <div key={date} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-purple-900">
            {format(new Date(date), "EEEE d MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-2 text-purple-800 font-semibold">
            BK League
            <img src={assets.bklogo} alt="PL" className="w-10" />
          </div>
        </div>

        <div className="space-y-4">
          {matches.map((match, i) => (
            <div
            key={i}
            className="flex items-center justify-between cursor-pointer bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-linear-to-r from-primary to-primary-dull hover:text-white transition">
                {/* Teams and Time Section */}
                <div className="grid grid-cols-3 items-center w-[25rem]">
                    {/* Home Team */}
                    <div className="flex items-center justify-start gap-2 font-semibold">
                        <img src={match.homeLogo} alt="" className="w-6 h-6" />
                        {match.homeTeam}
                    </div>
                    
                    {/* Kickoff Time */}
                    <div className="text-center text-sm font-medium">
                        {match.time}
                    </div>
                
                    {/* Away Team */}
                    <div className="flex items-center justify-end gap-2 font-semibold">
                        {match.awayTeam}
                        <img src={match.awayLogo} alt="" className="w-6 h-6" />
                    </div>
                </div>
            
                {/* Stadium */}
                <div className="text-sm flex items-center gap-1 flex-1 px-4 ml-50">
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
      </div>
    ))}
    </div>
  )
}

export default MatchList