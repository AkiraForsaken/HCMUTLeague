import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';

const Booking = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAppContext();
  const [match, setMatch] = useState(null);
  const [seatLevel, setSeatLevel] = useState('a');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/matches/${matchId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            logout();
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch match: ${response.status}`);
        }
        const matchData = await response.json();
        if (matchData.is_finished) {
          throw new Error('Cannot book tickets for finished matches');
        }
        setMatch(matchData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    console.log('Booking component mounted, user:', user, 'token:', token);
    if (!user || !token) {
      setError('Please log in to book tickets');
      setLoading(false);
      navigate('/signin');
    } else if (user.role !== 'Spectator') {
      setError('Only Spectators can book tickets');
      setLoading(false);
    } else {
      fetchMatch();
    }
  }, [matchId, user, token, navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBookingSuccess(null);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/matches/${matchId}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ seat_level: seatLevel.toLowerCase(), quantity }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to book tickets: ${response.status}`);
      }

      const data = await response.json();
      setBookingSuccess(data.view_match_id);
    } catch (err) {
      setError(err.message);
    }
  };

  const getPriceForLevel = (level) => {
    if (!match) return 0;
    const priceKey = `price_seat_level_${level.toLowerCase()}`;
    const price = parseFloat(match[priceKey]);
    return isNaN(price) ? 0 : price;
  };

  const getTotalPrice = () => {
    const price = getPriceForLevel(seatLevel);
    return (price * quantity).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin" />
          <span className="text-3xl font-semibold text-purple-700">Loading Booking...</span>
        </div>
      </div>
    );
  }

  if (error || !user || user.role !== 'Spectator') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-2xl font-semibold text-red-500 mb-6">
            {error || 'Only Spectators can book tickets'}
          </p>
          <Link
            to={`/matches/${matchId}`}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium text-lg"
          >
            Back to Match
          </Link>
          {!user && (
            <Link
              to="/signin"
              className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition font-medium text-lg"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-2xl font-semibold text-purple-700 mb-6">
            Booking Successful! Your booking ID is {bookingSuccess}.
          </p>
          <Link
            to={`/matches/${matchId}`}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium text-lg"
          >
            Back to Match
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-5xl font-bold text-purple-900 mb-8 text-center tracking-tight drop-shadow-md">
          Book Tickets
        </h1>
        <h2 className="text-3xl font-semibold text-purple-800 mb-6 text-center">
          {match?.home_team_name || 'Team 1'} vs {match?.away_team_name || 'Team 2'}
        </h2>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-purple-800 mb-2">
                Seat Level
              </label>
              <select
                value={seatLevel}
                onChange={(e) => setSeatLevel(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 border border-purple-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              >
                {['a', 'b', 'c', 'd'].map((level) => (
                  <option key={level} value={level}>
                    Level {level.toUpperCase()} (${getPriceForLevel(level).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-purple-800 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setQuantity(isNaN(val) || val < 1 ? 1 : val);
                }}
                min="1"
                className="w-full px-4 py-3 bg-white/90 border border-purple-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              />
            </div>
            <div className="text-xl font-semibold text-purple-700">
              Total Price: ${getTotalPrice()}
            </div>
            <div className="flex justify-between">
              <Link
                to={`/matches/${matchId}`}
                className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition font-medium text-lg"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium text-lg shadow-md"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;