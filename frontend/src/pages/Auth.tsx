import React from "react";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen -mt-28">
            <AuthForm />
        </div>
    );
}

export default Login;