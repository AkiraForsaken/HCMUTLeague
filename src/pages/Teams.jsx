import React from 'react'
import { teams } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'

const Teams = () => {
  const {navigate} = useAppContext();
  return (
    <div className='p-6 mx-auto'>
      <p className='text-2xl md:text-3xl font-medium my-6'>Teams</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-1440px'>
        {teams.map((team)=>(
          <div key={team.position} 
          className='group cursor-pointer p-4 gap-2 border shadow rounded-lg flex flex-col justify-between w-75 h-50 hover:text-white transition-colors'
          style={{backgroundColor: 'white'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = team.backgroundColor; // Change to team.backgroundColor on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'; // Revert to white when not hovered
          }}
          onClick={() => {
            navigate(`/teams/${team.club}`);
            scrollTo(0,0);
            }}>
            <img src={team.logo} alt={team.club} className='group-hover:scale-108 transition max-w-25'/>
            <div className='flex justify-between'> 
              <p className='text-md font-medium'>{team.club}</p>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  )
}

export default Teams