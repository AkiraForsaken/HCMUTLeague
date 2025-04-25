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
import News from './pages/News.jsx';
import MatchPage from './pages/MatchPage.jsx';  
import MyTickets from './pages/MyTickets.jsx';
import TicketDetails from './pages/TicketDetails.jsx';
import EditProfile from './pages/EditProfile.jsx';

function App() {
  return (
    <AppContextProvider>
      <div>
        <NavBar />
        <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:matchId" element={<MatchPage />} />
          <Route path="/matches/:matchId/booking" element={<Booking />} />
          <Route path="/teams/*" element={<Teams />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path="/stadiums/*" element={<Stadiums />} />
          <Route path="/posts" element={<News />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/mytickets/:viewMatchId" element={<TicketDetails />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
}

export default App;