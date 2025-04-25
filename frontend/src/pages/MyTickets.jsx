import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAppContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mytickets', {
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
          throw new Error(errorData.error || `Failed to fetch tickets: ${response.status}`);
        }

        const data = await response.json();
        setTickets(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user || !token) {
      setError('Please log in to view your tickets');
      setLoading(false);
      navigate('/signin');
    } else if (user.role !== 'Spectator') {
      setError('Only Spectators can view tickets');
      setLoading(false);
    } else {
      fetchTickets();
    }
  }, [user, token, navigate, logout]);

  const handleCancelTicket = async (viewMatchId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/mytickets/${viewMatchId}`, {
        method: 'DELETE',
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
        throw new Error(errorData.error || `Failed to cancel ticket: ${response.status}`);
      }

      setTickets(tickets.filter((ticket) => ticket.view_match_id !== viewMatchId));
      toast.success('Ticket cancelled successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

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
          <span className="text-3xl font-semibold text-purple-700">Loading Tickets...</span>
        </div>
      </div>
    );
  }

  if (error || !user || user.role !== 'Spectator') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center max-w-md">
          <p className="text-2xl font-semibold text-red-500 mb-6 drop-shadow-sm">
            {error || 'Only Spectators can view tickets'}
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
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold text-purple-900 mb-12 text-center tracking-tight drop-shadow-md">
          My Tickets
        </h1>
        {tickets.length === 0 ? (
          <div className="text-center animate-fade-in">
            <p className="text-xl text-purple-700 mb-6 font-medium">You have no tickets booked.</p>
            <Link
              to="/matches"
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book Tickets
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {tickets.map((ticket) => (
                <div
                  key={ticket.view_match_id}
                  className="bg-gradient-to-br from-white to-purple-50 backdrop-blur-md rounded-xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 animate-fade-in"
                >
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <img
                      src={ticket.home_team_logo || 'https://via.placeholder.com/56'}
                      alt={`${ticket.home_team_name} logo`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-2xl font-bold text-purple-800">vs</span>
                    <img
                      src={ticket.away_team_logo || 'https://via.placeholder.com/56'}
                      alt={`${ticket.away_team_name} logo`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h2 className="text-3xl font-semibold text-purple-900 text-center mb-4">
                    {ticket.home_team_name} vs {ticket.away_team_name}
                  </h2>
                  <div className="space-y-3 text-purple-700 text-lg">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {formatDateTime(ticket.match_date, ticket.match_time)}
                    </p>
                    <p>
                      <span className="font-medium">Stadium:</span> {ticket.stadium_name}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span> {ticket.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Seat:</span>{' '}
                      {ticket.seat || 'Unassigned'}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() => navigate(`/mytickets/${ticket.view_match_id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCancelTicket(ticket.view_match_id)}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center animate-fade-in">
              <Link
                to="/matches"
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Tickets
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyTickets;