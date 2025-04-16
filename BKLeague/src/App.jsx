import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from './context/AppContext.jsx';
import NavBar from './components/NavBar';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import Booking from './pages/Booking';
import Committee from './pages/Committee';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Stadiums from './pages/Stadium';

function App() {
  return (
    <AppContextProvider>
      <div>
        <NavBar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/teams/*" element={<Teams />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stadiums/*" element={<Stadiums />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
}

export default App;