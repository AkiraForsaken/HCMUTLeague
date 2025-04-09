import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const {user, setUser, setShowUserLogin, navigate} = useAppContext();

  const logout = async ()=>{
    setUser(null);
    navigate('/')
  }
  return (
    <nav className="bg-purple-900 text-white pr-3 flex justify-between items-center shadow-md relative top-0 left-0 right-0">

      <NavLink to='/' onClick={()=>setOpen(false)} className="flex items-center">
        <img src={assets.bklogo} alt='bklogo' className='h-15'/>
        <p className='text-2xl font-bold'>BK League</p>
      </NavLink>

      <div className="hidden sm:flex items-center gap-5">
        <NavLink to="/" className="hover:text-gray-300">Home</NavLink>
        <NavLink to="/matches" className="hover:text-gray-300">Matches</NavLink>
        <NavLink to="/teams" className="hover:text-gray-300">Teams</NavLink>
        <NavLink to="/booking" className="hover:text-gray-300">Booking</NavLink>
        <NavLink to="/committee" className="hover:text-gray-300">Committee</NavLink>
        {/* <NavLink to="/signin" className="hover:text-gray-300"><button>Sign In</button></NavLink> */}
        {!user ? (
          <NavLink to='/signin'>
            <button className="px-8 py-2 bg-indigo-500 hover:bg-primary transition text-white rounded-full" onClick={()=>{setShowUserLogin(true)}}>
              Login
            </button>
          </NavLink>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_pic} alt='profile_pic' className='w-10 rounded-lg'/>
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
              <li onClick={()=>navigate("booking")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer text-black'>My tickets</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer text-black'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile section - Don't care much */}
      <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
          <img src={assets.menu_icon} alt='menu' />
      </button>

      { open && (
        <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
        <NavLink to="/" onClick={()=>setOpen(false)} className="hover:text-gray-300 text-black">Home</NavLink>
        <NavLink to="/matches" onClick={()=>setOpen(false)} className="block hover:text-gray-300 text-black">Matches</NavLink>
        <NavLink to="/teams" onClick={()=>setOpen(false)} className="block hover:text-gray-300 text-black">Teams</NavLink>
        <NavLink to="/booking" onClick={()=>setOpen(false)} className="block hover:text-gray-300 text-black">Booking</NavLink>
        <NavLink to="/committee" onClick={()=>setOpen(false)} className="block hover:text-gray-300 text-black">Committee</NavLink>
        {/* <NavLink to="/signin" onClick={()=>setOpen(false)} className="block hover:text-gray-300 text-black"><button>Sign In</button></NavLink> */}
        {!user ? (
          <button className="px-8 py-2 bg-indigo-500 hover:bg-primary transition text-white rounded-full" onClick={()=>{setOpen(false);setShowUserLogin(true)}}>
            Login
          </button>
        ) : (
          <button className="px-8 py-2 bg-indigo-500 hover:bg-primary transition text-white rounded-full" onClick={logout}>
            Logout
          </button>
        )}
      </div>)}
    </nav>
  )
}

export default NavBar