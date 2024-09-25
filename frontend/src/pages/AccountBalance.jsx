import React, { useState } from 'react';
import axios from 'axios';
import { InputBox } from '../components/Inputbox';
import { useLocation, useNavigate } from 'react-router-dom';

const AccountBalance = () => {
    const [initialBalance, setInitialBalance] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const location = useLocation();
    const userId = location.state?.userId; // This may not be needed since the token has userId

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (!initialBalance) {
            setMessage('Please enter an initial balance.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage("User not authenticated.");
                return;
            }

            // Make API call to create the account
            const response = await axios.post(
                'https://secure-send-backend.onrender.com/account/create',
                { initialBalance, token }
            );

            if (response.status === 201) {
                setMessage('Account created successfully!');
                navigate("/dashboard"); // Navigate to dashboard upon success
            }
        } catch (error) {
            setMessage('Failed to create account: ' + (error.response?.data.message || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                    <InputBox
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        label={"Initial Balance"}
                        className="w-full"
                    />
                    <button
                        type="submit"
                        className="w-full h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Create Account
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default AccountBalance;
