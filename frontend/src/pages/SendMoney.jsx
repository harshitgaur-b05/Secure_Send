import { useSearchParams, useNavigate } from 'react-router-dom'; // Corrected import
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false); // Loading state
    const [message, setMessage] = useState(""); // Message for success/error
    const navigate = useNavigate(); // Initialized correctly

    const handleTransfer = async () => {
        if (amount <= 0) {
            setMessage("Please enter a valid amount."); // Validate amount
            return;
        }

        setLoading(true); // Set loading to true

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You need to be logged in to make a transfer.");
                setLoading(false);
                return;
            }

            console.log(id);
            console.log(amount);
            const response = await axios.post("http://localhost:3300/api/v1/account/transfer", {
                to: id,
                amount: Number(amount) // Convert to number
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Included token in header
                }
            });

            setMessage(response.data.message || "Transfer successful!"); // Success message
            navigate("/dashboard"); // Navigate to dashboard after success
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred."); // Error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    min="1" // Add min attribute for better UX
                                />
                            </div>
                            <button onClick={handleTransfer} 
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? "Processing..." : "Initiate Transfer"}
                            </button>
                            {message && <p className="text-center text-red-500">{message}</p>} {/* Display message */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
