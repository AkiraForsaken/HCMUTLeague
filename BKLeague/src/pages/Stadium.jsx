import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { assets } from '../assets/assets';

const API_BASE_URL = 'http://localhost:5000';

const StadiumList = ({ stadiums, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full"></div>
          <span className="text-2xl font-semibold text-indigo-700">Loading Stadiums...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-12">
        Our Stadiums
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto">
        {stadiums.map((stadium, index) => {
          const imageKey = stadium.stadium_name.toLowerCase().replace(/[^a-z]/g, '');
          const imageSrc = (stadium.stadium_photo_url && stadium.stadium_photo_url.trim() !== '')
            ? stadium.stadium_photo_url
            : assets[imageKey] || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Stadium';

          return (
            <div
              key={stadium.stadium_id}
              onClick={() => navigate(`/stadiums/${encodeURIComponent(stadium.stadium_name)}`)}
              className="cursor-pointer bg-white/60 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-72 rounded-t-3xl overflow-hidden bg-gradient-to-r from-indigo-200/20 to-purple-200/20">
                <img
                  src={imageSrc}
                  alt={`${stadium.stadium_name} view`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ backgroundColor: '#e5e7eb' }}
                />
                <div className="absolute inset-0 border-4 border-transparent hover:border-indigo-300/50 rounded-t-3xl transition"></div>
              </div>
              <div className="p-6 flex flex-col items-center space-y-3">
                <h2 className="text-3xl font-semibold text-indigo-900">
                  {stadium.stadium_name}
                </h2>
                <p className="text-base text-gray-700 truncate">{stadium.stadium_address || 'Not updated yet'}</p>
                <p className="text-base text-gray-700">
                  Capacity: {stadium.capacity ? stadium.capacity.toLocaleString() : 'Not updated yet'}
                </p>
                <div className="mt-auto inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition font-medium text-base">
                  <span>View Details</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StadiumDetails = () => {
  const { stadium_name } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stadiums/${encodeURIComponent(stadium_name)}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Fetch stadium response:', text);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setStadium(result.data);
        } else {
          setError(result.error || 'Failed to load stadium details.');
        }
      } catch (err) {
        console.error('Fetch stadium error:', err.message);
        setError(`Unable to connect to the server: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStadium();
  }, [stadium_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full"></div>
          <span className="text-2xl font-semibold text-indigo-700">Loading Stadium Details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/stadiums')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium"
          >
            Back to Stadiums
          </button>
        </div>
      </div>
    );
  }

  const imageKey = stadium.stadium_name.toLowerCase().replace(/[^a-z]/g, '');
  const imageSrc = (stadium.stadium_photo_url && stadium.stadium_photo_url.trim() !== '')
    ? stadium.stadium_photo_url
    : assets[imageKey] || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Stadium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header with Large Image */}
        <div className="relative w-full h-[32rem] rounded-t-3xl overflow-hidden">
          <img
            src={imageSrc}
            alt={`${stadium.stadium_name} view`}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ backgroundColor: '#e5e7eb' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h1 className="text-6xl font-extrabold">{stadium.stadium_name}</h1>
            <p className="text-xl mt-2 opacity-90">
              {stadium.stadium_another_name && stadium.stadium_another_name.trim() !== ''
                ? stadium.stadium_another_name
                : 'Not updated yet'}
            </p>
          </div>
        </div>
        {/* Body */}
        <div className="p-10 space-y-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-inner">
            <h2 className="text-3xl font-semibold text-indigo-800 mb-6">Stadium Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ['Stadium ID', stadium.stadium_id || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )],
                ['Address', stadium.stadium_address || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                )],
                ['Capacity', stadium.capacity ? stadium.capacity.toLocaleString() : 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M7 10h10m0 0H7m10 0a3 3 0 01-3-3V5a3 3 0 016 0v2a3 3 0 01-3 3z" />
                  </svg>
                )],
                ['Nickname', stadium.stadium_another_name || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10L7 17" />
                  </svg>
                )],
                ['Size', stadium.stadium_size || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
                  </svg>
                )],
                ['Construction Date', stadium.stadium_construction_date || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )],
                ['Construction Cost', stadium.stadium_construction_cost || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )],
                ['Owner Team', stadium.stadium_owner_team || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M7 10h10m0 0H7m10 0a3 3 0 01-3-3V5a3 3 0 016 0v2a3 3 0 01-3 3z" />
                  </svg>
                )],
                ['Public Transit', stadium.stadium_public_transit || 'Not updated yet', (
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4m-8 4V9m4 12V9" />
                  </svg>
                )],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex items-center space-x-4">
                  {icon}
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-lg font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/stadiums')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-md"
            >
              Back to Stadiums
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stadiums`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Fetch stadiums response:', text);
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setStadiums(result.data);
        } else {
          setError(result.error || 'Failed to load stadiums.');
        }
      } catch (err) {
        console.error('Fetch stadiums error:', err.message);
        setError(`Unable to connect to the server: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStadiums();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<StadiumList stadiums={stadiums} loading={loading} error={error} />} />
      <Route path=":stadium_name" element={<StadiumDetails />} />
    </Routes>
  );
};

export default Stadiums;