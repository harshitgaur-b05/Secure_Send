import { useState } from "react";
import { BottomWarning } from "../components/BottomWar.jsx";
import { Button } from "../components/Button.jsx";
import { Heading } from "../components/Heading.jsx";
import { InputBox } from "../components/Inputbox.jsx";
import { SubHeading } from "../components/SubHeading.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState(""); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    const handleSignup = async () => {
        setError(""); // Reset error state
        setLoading(true); // Set loading to true

        try {
            const response = await axios.post("http://localhost:3300/api/v1/user/signup", {
                username,
                password,
                firstname,
                lastname,
                email,
            });

            localStorage.setItem("token", response.data.token);

            // Method 1: Passing userId using URL parameter
            // navigate(`/accountbalance/${response.data.userId}`);

            // Method 2: Passing userId using state
            navigate("/accountbalance");

        } catch (err) {
            setError(err.response?.data.msg || "Signup failed. Please try again."); // Set error message
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    {error && <div className="text-red-500">{error}</div>}
                    
                    <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" label={"First Name"} />
                    <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" label={"Last Name"} />
                    <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="Username" label={"Username"} />
                    <InputBox onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" label={"Password"} />
                    <InputBox onChange={(e) => setEmail(e.target.value)} placeholder="Email" label={"Email"} />
                    
                    <div className="pt-4">
                        <Button 
                            onClick={handleSignup} 
                            label={loading ? "Signing up..." : "Sign up"} 
                            disabled={loading} 
                        />
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );
};
