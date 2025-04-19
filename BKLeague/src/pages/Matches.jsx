import React from 'react'
import MatchList from '../components/MatchList'

const Matches = () => {
  return (
    <div className='min-h-screen text-center'>
        <div className="animate-fade-in">
          <MatchList></MatchList>
        </div>
    </div>
  )
}

export default Matches