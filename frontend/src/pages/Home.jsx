// src/HomePage.js
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
            <p className="mb-6">Please sign in or sign up to continue.</p>
            <div className="space-x-4">
                {/* <Link to="/signin">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Sign In
                    </button>
                </Link> */}
                <Link to="/signup">
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
