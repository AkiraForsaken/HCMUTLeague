import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {prettifyFieldName} from './Register'

const API_BASE_URL = 'http://localhost:5000';

const EditProfile = () => {
    const roleFields = {
        admin: ['username', 'password', 'email'],
        team: ['name', 'city', 'country', 'trophy', 'team_logo_url'],
        player: [
            'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
            'com_street', 'postal_code', 'squad_number', 'position_player',
            'weight', 'height', 'team_name',
        ],
        coach: [
            'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
            'com_street', 'postal_code', 'team_name', 'coach_title',
        ],
        personal_doctor: [
            'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
            'com_street', 'postal_code', 'team_name', 'doctor_title',
            'supported_player_id',
        ],
        club_doctor: [
            'username', 'password', 'email', 'com_first_name', 'com_last_name', 'age',
            'com_street', 'postal_code', 'team_name', 'doctor_title',
        ],
        main_referee: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
        match_manager: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
        video_assistant_referee: ['username', 'password', 'email', 'com_mem_first_name', 'last_name', 'nationality'],
        sponsor: ['username', 'password', 'email', 'com_mem_first_name', 'com_mem_last_name', 'nationality'],
        spectator: ['username', 'password', 'email', 'first_name', 'last_name', 'nationality'],
    };

    const fieldTypes = {
        password: 'password',
        email: 'email',
        age: 'number',
        weight: 'number',
        height: 'number',
        squad_number: 'number',
    }

    const [formData, setFormData] = useState({});
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Error getting token');
                navigate('/signin');
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                })
                const result = await res.json();
                if (result.success) {
                    const normalizedRole = result.data.role.toLowerCase().replace(/\s+/g, '_');
                    if (roleFields[normalizedRole]) {
                        setRole(normalizedRole);
                        setFormData(result.data);
                    } else {
                        toast.error('Invalid role received from backend');
                    }
                } else {
                    toast.error(result.error || 'Failed to load profile');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching profile');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [navigate]);

    // Fetch teams for selection
    useEffect(()=>{
        const fetchTeams = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/teams`);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const result = await res.json();
                if (result.success) {
                    setTeams(result.data);
                } else {
                    toast.error('Failed to fetch teams');
                } 
            } catch (err) {
                console.error(err);
                toast.error('Error fetching teams');
            }
        };

        fetchTeams();
    }, []);

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => {
          let updatedData;
      
          if (['username', 'password', 'email'].includes(field)) {
            // Handle basic fields directly
            updatedData = { ...prev, [field]: e.target.value };
          } else if (['main_referee', 'match_manager', 'video_assistant_referee', 'sponsor', 'spectator'].includes(role)) {
            // Handle committee_info fields
            updatedData = {
              ...prev,
              committee_info: {
                ...prev.committee_info,
                [field]: e.target.value,
              },
            };
          } else if (['player', 'coach', 'personal_doctor', 'club_doctor'].includes(role)) {
            // Handle role-specific nested fields
            updatedData = {
              ...prev,
              [`${role}_info`]: {
                ...prev[`${role}_info`],
                [field]: e.target.value,
              },
            };
          } else {
            // Handle other general fields
            updatedData = { ...prev, [field]: e.target.value };
          }
          return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Error getting token');
            return;
        }
        const updatedFormData = { ...formData };
        if (!updatedFormData.password) {
            delete updatedFormData.password;
        }
        console.log('Updated Form Data:', updatedFormData);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT', // Updating the profile
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedFormData),
            });
            const result = await res.json();
            if (result.success) {
                toast.success('Profile updated successfully');
                navigate('/profile');
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error updating profile');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
                {roleFields[role].map((field) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                        {prettifyFieldName(field)}
                    </label>
                    {field === 'team_name' ? ( // TEAM DROPDOWN
                    <select
                        value={
                        role === 'main_referee' || role === 'match_manager' || role === 'video_assistant_referee' || role === 'sponsor' || role === 'spectator'
                            ? formData.committee_info?.[field] || ''
                            : formData[`${role}_info`]?.[field] || formData[field] || ''
                        }
                        onChange={handleInputChange(field)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="" disabled>
                        Select a team
                        </option>
                        {teams.map((team) => (
                        <option key={team.team_id} value={team.team_name}>
                            {team.team_name}
                        </option>
                        ))}
                    </select>
                    ) : (
                    <input
                        type={fieldTypes[field] || 'text'}
                        value={
                        role === 'main_referee' || role === 'match_manager' || role === 'video_assistant_referee' || role === 'sponsor' || role === 'spectator'
                            ? formData.committee_info?.[field] || formData[field] || ''
                            : formData[`${role}_info`]?.[field] || formData[field] || ''
                        }
                        onChange={handleInputChange(field)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required={field !== 'password'}
                    />
                    )}
                </div>
                ))}
            </div>
            <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
                Save Changes
            </button>
        </form>
        </div>
    )
}

export default EditProfile