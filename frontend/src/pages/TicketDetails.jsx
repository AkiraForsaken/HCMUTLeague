import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';

const TicketDetails = () => {
  const navigate = useNavigate();
  const { viewMatchId } = useParams();
  const { user, token, logout } = useAppContext();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/mytickets/${viewMatchId}`, {
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
          throw new Error(errorData.error || `Failed to fetch ticket: ${response.status}`);
        }

        const data = await response.json();
        setTicket(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user || !token) {
      setError('Please log in to view ticket details');
      setLoading(false);
      navigate('/signin');
    } else if (user.role !== 'Spectator') {
      setError('Only Spectators can view ticket details');
      setLoading(false);
    } else {
      fetchTicket();
    }
  }, [user, token, viewMatchId, navigate, logout]);

  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin" />
          <span className="text-3xl font-semibold text-purple-700">Loading Ticket...</span>
        </div>
      </div>
    );
  }

  if (error || !user || user.role !== 'Spectator') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center max-w-md">
          <p className="text-2xl font-semibold text-red-500 mb-6 drop-shadow-sm">
            {error || 'Only Spectators can view ticket details'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/matches"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              View Matches
            </Link>
            {!user && (
              <Link
                to="/signin"
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center max-w-md">
          <p className="text-2xl font-semibold text-red-500 mb-6 drop-shadow-sm">
            Ticket not found
          </p>
          <Link
            to="/mytickets"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}
      </style>
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold text-purple-900 mb-12 text-center tracking-tight drop-shadow-md">
          Ticket Details
        </h1>
        <div className="bg-gradient-to-br from-white to-purple-50 backdrop-blur-md rounded-xl p-8 shadow-xl border border-purple-200 animate-fade-in relative">
          <div className="absolute top-4 right-4">
            <span
              className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                ticket.is_finished ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {ticket.is_finished ? 'Finished' : 'Upcoming'}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-6 mb-6">
            <img
              src={ticket.home_team_logo || 'https://via.placeholder.com/72'}
              alt={`${ticket.home_team_name} logo`}
              className="w-18 h-18 rounded-full object-cover border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <span className="text-3xl font-bold text-purple-800">vs</span>
            <img
              src={ticket.away_team_logo || 'https://via.placeholder.com/72'}
              alt={`${ticket.away_team_name} logo`}
              className="w-18 h-18 rounded-full object-cover border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-4xl font-semibold text-purple-900 text-center mb-6">
            {ticket.home_team_name} vs {ticket.away_team_name}
          </h2>
          <div className="space-y-4 text-purple-700 text-lg">
            <p>
              <span className="font-medium">Date:</span>{' '}
              {formatDateTime(ticket.match_date, ticket.match_time)}
            </p>
            <p>
              <span className="font-medium">Stadium:</span> {ticket.stadium_name}
            </p>
            <p>
              <span className="font-medium">Seat:</span> {ticket.seat || 'Unassigned'}
            </p>
            <p>
              <span className="font-medium">Seat Level:</span> {ticket.seat_level.toUpperCase()}
            </p>
            <p>
              <span className="font-medium">Quantity:</span> {ticket.quantity}
            </p>
            <p>
              <span className="font-medium">Total Price:</span> £
              {parseFloat(ticket.total_price).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Price per Level-A Seat:</span> £
              {parseFloat(ticket.price_seat_level_a).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Price per Level-B Seat:</span> £
              {parseFloat(ticket.price_seat_level_b).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Price per Level-C Seat:</span> £
              {parseFloat(ticket.price_seat_level_c).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Price per Level-D Seat:</span> £
              {parseFloat(ticket.price_seat_level_d).toFixed(2)}
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              to="/mytickets"
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;