import React from 'react'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.soccer_banner} alt="banner" className='w-full object-contain'/>
        <div className='mx-auto max-w-[1376px] absolute inset-0'>
            <div className='flex-center flex-wrap h-[70vh]'>
                <div className='flex flex-col ml-auto mr-30 max-w-[35%]'>
                    <h1 className='text-7xl text-white mb-5'>Welcome to <span className='text-primary'>BK League</span></h1>
                    <p>MAKE THEM BELIEVE</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MainBanner