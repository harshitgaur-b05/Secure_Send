import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null); // Initialize state for balance
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [error, setError] = useState(null); // Initialize error state

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from local storage
                const response = await axios.get("https://secure-send-backend.onrender.com/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in headers
                    },
                });
                setBalance(response.data.balance); // Set balance from response
            } catch (error) {
                setError(" YOUR account doesnt exist"); // Set error message
                console.error("Error fetching balance:", error.response ? error.response.data : error.message);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchBalance(); // Call the fetch function
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {loading ? ( // Show loading indicator while fetching
                    <p>Loading...</p>
                ) : error ? ( // Show error message if there's an error
                    <p>{error}</p>
                ) : (
                    <Balance value={balance} /> // Display the balance once fetched
                )}
                <Users />
            </div>
        </div>
    );
};
