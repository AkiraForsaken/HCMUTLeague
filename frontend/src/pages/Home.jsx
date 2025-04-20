import React from 'react'
import LeagueTable from '../components/LeagueTable'
import MainBanner from '../components/MainBanner'

const Home = () => {
  return (
    <div className='min-h-screen relative'>
      <MainBanner></MainBanner>
      <LeagueTable></LeagueTable>
    </div>
  )
}

export default Home