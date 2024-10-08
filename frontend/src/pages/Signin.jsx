import { useState } from "react";
import { BottomWarning } from "../components/BottomWar.jsx";
import { Button } from "../components/Button.jsx";
import { Heading } from "../components/Heading.jsx";
import { InputBox } from "../components/Inputbox.jsx";
import { SubHeading } from "../components/SubHeading.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          
          <InputBox 
            onChange={(e) => {
              setUsername(e.target.value);
            }} 
            placeholder="name you saved" 
            label={"Username"} 
          />

          <InputBox 
            onChange={(e) => {
              setPassword(e.target.value);
            }} 
            placeholder="123456" 
            label={"Password"} 
          />

          <div className="pt-4">
            <Button 
              onClick={async () => {
                try {
                  const response = await axios.post("https://secure-send-backend.onrender.com/user/signin", {
                    username,
                    password
                  });
                  localStorage.setItem("token", response.data.token);
                  navigate("/dashboard");
                } catch (error) {
                  console.error("Error during sign-in:", error);
                }
              }} 
              label={"Sign in"} 
            />
          </div>

          <BottomWarning 
            label={"Don't have an account?"} 
            buttonText={"Sign up"} 
            to={"/signup"} 
          />
        </div>
      </div>
    </div>
  );
};

