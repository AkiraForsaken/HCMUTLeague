import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Teams from './pages/Teams'
import Booking from './pages/Booking'
import Committee from './pages/Committee'

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/matches' element={<Matches />}/>
        <Route path='/teams' element={<Teams />}/>
        <Route path='/booking' element={<Booking />}/>
        <Route path='/committee' element={<Committee />}/>
        <Route path='/signin' element={<Signin/>}/>
      </Routes>
    </>
  )
}

export default App
